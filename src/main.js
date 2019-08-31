import api from './api';

class App {
    constructor() {
        this.repositorios = [];

        this.FormEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repositorio]');
        this.ListRP = document.getElementById('repo-list');

        this.registerHandlers();
        
    }

    registerHandlers() {
        this.FormEl.onsubmit = (event) => this.addRepositorio(event); 
    }

    setCarregando(loading = true){
        if(loading === true) {
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Carregando...'));

            loadingEl.setAttribute('id','loading');

            this.FormEl.appendChild(loadingEl);
        } else {
            document.getElementById('loading').remove();
        }
    }

    async addRepositorio(event) {
        event.preventDefault();

        const valueInput = this.inputEl.value;

        if(valueInput.length === 0) {
            return; // PARADA
        }

        this.setCarregando();

        try {
            const response = await api.get(`/repos/${valueInput}`);

            const { name, description, html_url, owner: { avatar_url } } = response.data;

            this.repositorios.push({
                name,
                description,
                avatar_url,
                html_url,
            });

            this.inputEl.value = '';

            this.render();
        } catch (err) {
            alert('O repositorio não existe');
        }

        this.setCarregando(false);
        
    }

    render() {
        this.ListRP.innerHTML = '';

        this.repositorios.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descEl = document.createElement('p');
            descEl.appendChild(document.createTextNode(repo.description));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);

            linkEl.appendChild(document.createTextNode('Acessar'));

            let listItemEl = document.createElement('li');

            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descEl);
            listItemEl.appendChild(linkEl);

            this.ListRP.appendChild(listItemEl);
        });
    }
}

new App();