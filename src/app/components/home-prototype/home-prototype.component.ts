import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-home-prototype',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatDividerModule,
        MatListModule
    ],
    templateUrl: './home-prototype.component.html',
    styleUrls: ['./home-prototype.component.scss']
})
export class HomePrototypeComponent {

    apoiadores = [
        {
            nome: 'Apoiador 1 - Google',
            link: 'https://www.google.com',
            imgDesktop: 'assets/ap1_desktop.png',
            imgMobile: 'assets/ap1_mobile.png'
        },
        {
            nome: 'Apoiador 2 - Bing',
            link: 'https://www.bing.com',
            imgDesktop: 'assets/ap2_desktop.png',
            imgMobile: 'assets/ap2_mobile.png'
        }
    ];

    grupos = [
        { id: 1, nome: 'Classe 1', linkTabela: '#', linkFormulario: '#' },
        { id: 2, nome: 'Classe 2', linkTabela: '#', linkFormulario: '#' },
        { id: 3, nome: 'Classe 3', linkTabela: '#', linkFormulario: '#' },
        { id: 4, nome: 'Classe 4', linkTabela: '#', linkFormulario: '#' },
        { id: 5, nome: 'Classe 5', linkTabela: '#', linkFormulario: '#' }
    ];

    constructor() { }
}
