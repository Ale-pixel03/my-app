import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonContent, 
  IonButton, 
  IonFooter, 
  IonIcon, 
  IonToolbar, 
  IonTitle 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { caretDownOutline, caretUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonContent, 
    IonButton, 
    IonFooter, 
    IonIcon, 
  ],
})
export class HomePage implements OnInit {

  public numero: number = 0;
  public readonly MINIMO: number = 0;
  public readonly MAXIMO: number = 10;
  private readonly KEY_NUMBER: string = 'ddr_key_number';

  constructor() {
    addIcons({
      caretUpOutline,
      caretDownOutline
    });
  }

  ngOnInit() {
    console.log('-> ngOnInit ejecutado');
    this.loadNumber();
  }

  loadNumber() {
    try {
      const savedValue = localStorage.getItem(this.KEY_NUMBER);
      console.log('-> Valor leído de localStorage:', savedValue);

      if (savedValue !== null && savedValue !== undefined) {
        const parsed = Number(savedValue);
        if (!isNaN(parsed) && parsed >= this.MINIMO && parsed <= this.MAXIMO) {
          this.numero = parsed;
        } else {
          this.numero = this.MINIMO;
        }
      } else {
        this.numero = this.MINIMO;
      }
    } catch (error) {
      console.error('Error al leer localStorage:', error);
      this.numero = this.MINIMO;
    }
  }

  saveNumber() {
    try {
      localStorage.setItem(this.KEY_NUMBER, this.numero.toString());
      console.log('-> ¡Guardado exitoso en localStorage!', this.numero);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  counterup() {
    if (this.numero < this.MAXIMO) {
      this.numero++;
      this.saveNumber();
    }
  }

  counterdown() {
    if (this.numero > this.MINIMO) {
      this.numero--;
      this.saveNumber();
    }
  }
}