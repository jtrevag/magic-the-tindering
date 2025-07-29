import jsPDF from 'jspdf';
import { Card } from '../types/Card';

interface CardImageData {
  card: Card;
  imageData: string;
}

export class ProxyPDFGenerator {
  private static readonly CARD_WIDTH_MM = 63;
  private static readonly CARD_HEIGHT_MM = 88;
  private static readonly CARDS_PER_ROW = 3;
  private static readonly CARDS_PER_COL = 3;
  private static readonly CARDS_PER_PAGE = 9;
  private static readonly PAGE_WIDTH_MM = 216; // 8.5 inches
  private static readonly PAGE_HEIGHT_MM = 279; // 11 inches
  private static readonly MARGIN_MM = 10;

  static async generateProxyPDF(cards: Card[]): Promise<void> {
    try {
      const cardImages = await this.loadCardImages(cards);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      let currentPage = 0;
      let cardIndex = 0;

      while (cardIndex < cardImages.length) {
        if (currentPage > 0) {
          pdf.addPage();
        }

        this.addCardsToPage(pdf, cardImages.slice(cardIndex, cardIndex + this.CARDS_PER_PAGE));
        cardIndex += this.CARDS_PER_PAGE;
        currentPage++;
      }

      const filename = `mtg-draft-proxies-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating proxy PDF:', error);
      throw new Error('Failed to generate proxy PDF');
    }
  }

  private static async loadCardImages(cards: Card[]): Promise<CardImageData[]> {
    console.log(`Loading images for ${cards.length} cards...`);
    
    const imagePromises = cards.map(async (card, index) => {
      try {
        console.log(`Processing card ${index + 1}/${cards.length}: ${card.name}`);
        
        // Try multiple approaches for loading images
        let imageData = '';
        
        // Approach 1: Use CORS proxy
        try {
          const originalUrl = `https://cards.scryfall.io/normal/front/${card.scryfallId.charAt(0)}/${card.scryfallId.charAt(1)}/${card.scryfallId}.jpg`;
          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
          imageData = await this.loadImageAsBase64(proxyUrl);
          console.log(`Successfully loaded image for ${card.name} via proxy`);
        } catch (proxyError) {
          console.warn(`Proxy approach failed for ${card.name}:`, proxyError);
          
          // Approach 2: Try server-side rendering approach using existing DOM images
          try {
            imageData = await this.captureExistingImage(card);
            if (imageData) {
              console.log(`Successfully captured existing image for ${card.name}`);
            }
          } catch (domError) {
            console.warn(`DOM capture failed for ${card.name}:`, domError);
          }
        }
        
        return { card, imageData };
      } catch (error) {
        console.warn(`All approaches failed for card ${card.name}:`, error);
        return { card, imageData: '' };
      }
    });

    const results = await Promise.all(imagePromises);
    const successCount = results.filter(r => r.imageData).length;
    console.log(`Loaded ${successCount}/${cards.length} images successfully`);
    
    return results;
  }

  private static loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        try {
          const dataURL = canvas.toDataURL('image/jpeg', 0.9);
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;
    });
  }

  private static async captureExistingImage(card: Card): Promise<string> {
    return new Promise((resolve, reject) => {
      // Look for existing images in the DOM that match this card
      const existingImages = document.querySelectorAll('img');
      const cardImageUrl = `https://cards.scryfall.io/normal/front/${card.scryfallId.charAt(0)}/${card.scryfallId.charAt(1)}/${card.scryfallId}.jpg`;
      
      for (let i = 0; i < existingImages.length; i++) {
        const img = existingImages[i];
        if (img.src === cardImageUrl && img.complete && img.naturalWidth > 0) {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              continue;
            }

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            
            const dataURL = canvas.toDataURL('image/jpeg', 0.9);
            resolve(dataURL);
            return;
          } catch (error) {
            console.warn('Failed to capture existing image:', error);
            continue;
          }
        }
      }
      
      reject(new Error('No existing image found'));
    });
  }

  private static addCardsToPage(pdf: jsPDF, cardImages: CardImageData[]): void {
    const availableWidth = this.PAGE_WIDTH_MM - (2 * this.MARGIN_MM);
    const availableHeight = this.PAGE_HEIGHT_MM - (2 * this.MARGIN_MM);
    
    const spacingX = (availableWidth - (this.CARDS_PER_ROW * this.CARD_WIDTH_MM)) / (this.CARDS_PER_ROW - 1);
    const spacingY = (availableHeight - (this.CARDS_PER_COL * this.CARD_HEIGHT_MM)) / (this.CARDS_PER_COL - 1);

    cardImages.forEach((cardImage, index) => {
      const row = Math.floor(index / this.CARDS_PER_ROW);
      const col = index % this.CARDS_PER_ROW;
      
      const x = this.MARGIN_MM + col * (this.CARD_WIDTH_MM + spacingX);
      const y = this.MARGIN_MM + row * (this.CARD_HEIGHT_MM + spacingY);

      if (cardImage.imageData) {
        try {
          pdf.addImage(
            cardImage.imageData,
            'JPEG',
            x,
            y,
            this.CARD_WIDTH_MM,
            this.CARD_HEIGHT_MM
          );
        } catch (error) {
          console.warn(`Failed to add image for card ${cardImage.card.name}:`, error);
          this.addPlaceholderCard(pdf, cardImage.card, x, y);
        }
      } else {
        this.addPlaceholderCard(pdf, cardImage.card, x, y);
      }
    });
  }

  private static addPlaceholderCard(pdf: jsPDF, card: Card, x: number, y: number): void {
    // Create a more detailed placeholder card
    pdf.setDrawColor(0, 0, 0);
    pdf.setFillColor(245, 245, 245);
    pdf.rect(x, y, this.CARD_WIDTH_MM, this.CARD_HEIGHT_MM, 'FD');
    
    // Add border
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(x, y, this.CARD_WIDTH_MM, this.CARD_HEIGHT_MM);
    
    // Add content
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const textX = x + this.CARD_WIDTH_MM / 2;
    let textY = y + 15;
    
    // Card name (wrap if needed)
    const nameWords = card.name.split(' ');
    let currentLine = '';
    const maxLineWidth = this.CARD_WIDTH_MM - 8;
    
    for (const word of nameWords) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = pdf.getTextWidth(testLine);
      
      if (textWidth > maxLineWidth && currentLine) {
        pdf.text(currentLine, textX, textY, { align: 'center' });
        textY += 6;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      pdf.text(currentLine, textX, textY, { align: 'center' });
      textY += 10;
    }
    
    // Mana cost
    if (card.manaCost) {
      pdf.setFontSize(8);
      pdf.text(`Cost: ${card.manaCost}`, textX, textY, { align: 'center' });
      textY += 8;
    }
    
    // Type
    pdf.setFontSize(7);
    const typeWords = card.type.split(' ');
    let typeLine = '';
    
    for (const word of typeWords) {
      const testLine = typeLine + (typeLine ? ' ' : '') + word;
      const textWidth = pdf.getTextWidth(testLine);
      
      if (textWidth > maxLineWidth && typeLine) {
        pdf.text(typeLine, textX, textY, { align: 'center' });
        textY += 5;
        typeLine = word;
      } else {
        typeLine = testLine;
      }
    }
    
    if (typeLine) {
      pdf.text(typeLine, textX, textY, { align: 'center' });
    }
    
    // Add "PROXY" watermark
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('PROXY', textX, y + this.CARD_HEIGHT_MM - 5, { align: 'center' });
  }
}