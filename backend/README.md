## Price Tracker Services


Esta aplicación corresponde al backend del proyecto. Se trata de un servidor de Express desarrollado con NodeJS y TypeScript.

<hr>

### Comandos relevantes

```
npm install
```
Este comando instalará todas las dependencias necesarias para la ejecución del proyecto.
```
npm run dev
```
Este comando arranca el proyecto en modo de desarrollo, a través de la configuración del archivo nodemon.json. El modo desarrollo es ejecutado por medio de nodemon y ts-node, por lo cual tendremos actualizaciones de nuestro código cada vez que guardemos nuestros avances.

```
npm run build
```
Este comando borra (si es que existe) y crea la carpeta 'build', en dónde procesara todo el código del proyecto y lo compilara a Javascript puro. Comando para generar builds de producción.

```
npm run start
```
Este comando hace lo mismo que el anterior, pero además, ejecuta el proyecto desde el archivo principal del proyecto, ya en Javascript. Comando para ejecutar un build en producción.

