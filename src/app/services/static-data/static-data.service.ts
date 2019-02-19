import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface DocumentTypes {
  label: string,
  value: number
}

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  public faculties = [
    { label: 'Artes', value: 'Artes' },
    { label: 'Ciencias', value: 'Ciencias' },
    { label: 'Ciencias Agrarias', value: 'Ciencias Agrarias' },
    { label: 'Ciencias Económicas', value: 'Ciencias Económicas' },
    { label: 'Ciencias Humanas', value: 'Ciencias Humanas' },
    { label: 'Derecho, Ciencias Políticas y Sociales', value: 'Derecho, Ciencias Políticas y Sociales' },
    { label: 'Enfermería', value: 'Enfermería' },
    { label: 'Ingeniería', value: 'Ingeniería' },
    { label: 'Medicina', value: 'Medicina' },
    { label: 'Medicina Veterinaria y de Zootecnia', value: 'Medicina Veterinaria y de Zootecnia' },
    { label: 'Odontología', value: 'Odontología' },
  ]

  public allCountries = []

  nameRegex = /[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+/
  numberRegex = /[0-9]+/

  constructor( private http: HttpClient ) { }

}
