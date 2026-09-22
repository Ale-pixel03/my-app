import { Component } from '@angular/core';
import { IonHeader,IonContent,IonButton, IonFooter} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  
  imports: [IonButton,IonHeader, IonContent ,IonFooter],
})
//aqui va toda la logica de la pagina
  // variables y metodos 
export class HomePage {

  public numero:number =0;
  constructor() {}
}
