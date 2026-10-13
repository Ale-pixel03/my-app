import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonList, 
  IonItemSliding, 
  IonItemOption, 
  IonItemOptions, 
  IonReorder, 
  IonReorderGroup, 
  ReorderEndCustomEvent, 
  IonLabel 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { ChangeDetectorRef } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertControllerService } from '../../services/alert';

@Component({
  selector: 'app-talk-list',
  templateUrl: './talk-list.page.html',
  styleUrls: ['./talk-list.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonLabel,
    IonList,
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
    IonReorder, 
    IonReorderGroup,
  ],
})
export class TalkListPage {
  private cdr = inject(ChangeDetectorRef);
  private alertControllerService = inject(AlertControllerService);

  public tasks: string[] = []; 
  public task: string = '';
  private readonly KEY_TASKS: string = 'talk_list_tasks';

  constructor() {
    addIcons({
      addOutline,
      trashOutline
    });
  }

  // Se ejecuta cada vez que entras a la vista o actualizas la página
  async ionViewWillEnter() {
    await this.loadTasks();
  }

  // Carga las tareas usando Capacitor Preferences
  private async loadTasks() {
    const { value } = await Preferences.get({ key: this.KEY_TASKS });
    
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          this.tasks = parsed;
        }
      } catch (e) {
        console.error('Error al parsear tareas:', e);
      }
    } else {
      // Tareas por defecto si es la primera vez que se abre la app
      this.tasks = [
        "Comprar Leche",
        "Comprar Pan",
        "Comprar Huevos",
      ];
      this.saveTasks();
    }
    this.cdr.markForCheck();
  }

  // Guarda las tareas usando Capacitor Preferences
  private saveTasks() {
    Preferences.set({
      key: this.KEY_TASKS,
      value: JSON.stringify(this.tasks),
    });
  }

  addTask() {
    console.log(this.task);
    if (!this.task || this.task.trim() === '') return;

    if (!this.ifExistTask(this.task)) {
      this.tasks.push(this.task.trim());
      this.saveTasks();
      this.task = '';
      this.alertControllerService.presentAlert('Tarea Agregada', 'La tarea se agregó correctamente');
      this.cdr.markForCheck();
    } else {
      this.alertControllerService.presentAlert('Tarea Existente', 'La tarea ya existe en la lista');
    }
  }

  private ifExistTask(task: string) {
    return this.tasks.find(
      (item: string) => task.toUpperCase().trim() === item.toUpperCase().trim()
    );
  }

  confirmDeleteTask(task: string) {
    this.alertControllerService.alertConfirm(
      'Confirmar Eliminación',
      'Eliminar Tarea',
      `¿Estás seguro de que deseas eliminar esta tarea?`,
      'Eliminar',
      () => this.deleteTask(task),
    );
  }

  private deleteTask(task: string) {
    console.log('La tarea a eliminar es:', task);

    const index = this.tasks.findIndex(
      (item: string) => item.toLowerCase().trim() === task.toLowerCase().trim()
    );

    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      this.cdr.markForCheck();
    }
  }

  handleReorderEnd(event: ReorderEndCustomEvent) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

    const itemMoved = this.tasks.splice(event.detail.from, 1)[0];
    this.tasks.splice(event.detail.to, 0, itemMoved);
    
    this.saveTasks();
    event.detail.complete();
    this.cdr.markForCheck();
  }
}