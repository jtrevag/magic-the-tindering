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
        const imageUrl = `https://cards.scryfall.io/normal/front/${card.scryfallId.charAt(0)}/${card.scryfallId.charAt(1)}/${card.scryfallId}.jpg`;
        console.log(`Loading image ${index + 1}/${cards.length}: ${card.name} from ${imageUrl}`);
        
        const imageData = await this.loadImageAsBase64(imageUrl);
        console.log(`Successfully loaded image for ${card.name}`);
        return { card, imageData };
      } catch (error) {
        console.warn(`Failed to load image for card ${card.name}:`, error);
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
      fetch(url, { mode: 'cors' })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read blob as base64'));
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.warn(`Fetch failed for ${url}, trying Image approach:`, error);
          
          // Fallback to Image approach
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
    pdf.setDrawColor(0, 0, 0);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(x, y, this.CARD_WIDTH_MM, this.CARD_HEIGHT_MM, 'FD');
    
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    
    const textX = x + this.CARD_WIDTH_MM / 2;
    const textY = y + this.CARD_HEIGHT_MM / 2;
    
    pdf.text(card.name, textX, textY - 5, { align: 'center', maxWidth: this.CARD_WIDTH_MM - 4 });
    pdf.text(card.manaCost || '', textX, textY, { align: 'center', maxWidth: this.CARD_WIDTH_MM - 4 });
    pdf.text(card.type, textX, textY + 5, { align: 'center', maxWidth: this.CARD_WIDTH_MM - 4 });
  }
}