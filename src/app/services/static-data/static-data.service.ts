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

  public levelXp = [
    { label: 'Menos de 3 meses', value: 'Menos de 3 meses' },
    { label: 'De 3 a 6 meses', value: 'De 3 a 6 meses' },
    { label: 'De 6 a 12 meses', value: 'De 6 a 12 meses' },
    { label: 'De 1 a 3 años', value: 'De 1 a 3 años' },
    { label: 'Más de 3 años', value: 'Más de 3 años' },
  ]

  public speedOptions = [
    { label: 'Lento', value: 'Lento' },
    { label: 'Moderado', value: 'Moderado' },
    { label: 'Rápido', value: 'Rápido' },
    { label: 'Muy Rápido', value: 'Muy rápido' },
  ]

  public locations = [
    'Usaquén',
    'Chapinero',
    'Santa Fe',
    'San Cristóbal',
    'Usme',
    'Tunjuelito',
    'Bosa',
    'Kennedy',
    'Fontibón',
    'Engativá',
    'Suba',
    'Barrios Unidos',
    'Teusaquillo',
    'Los Mártires',
    'Antonio Nariño',
    'Puente Aranda',
    'La Candelaria',
    'Rafael Uribe Uribe',
    'Ciudad Bolívar',
    'Sumapaz',
    'Soacha',
  ]
  
  public roadPreference = [
    'Cicloruta',
    'Calzada',
    'Ambas'
  ]

  public exitPreference = [
    'Por la 45',
    'Por la 26',
    'Por el Uriel',
    'Por la 53'
  ]

  public hourPreference = [
    '7:00 A.M.',
    '8:00 A.M.',
    '9:00 A.M.',
    '10:00 A.M.',
    '11:00 A.M.',
    '12:00 P.M.',
    '1:00 P.M.',
    '2:00 P.M.',
    '3:00 P.M.',
    '4:00 P.M.',
    '5:00 P.M.',
    '6:00 P.M.',
    '7:00 P.M.',
    '8:00 P.M.',
    '9:00 P.M.',
    '10:00 P.M.',
    '11:00 P.M.',
  ]

  nameRegex = /[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+/
  numberRegex = /[0-9]+/

  constructor( private http: HttpClient ) { }

}
