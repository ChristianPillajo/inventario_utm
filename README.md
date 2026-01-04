Desarrollo Backend

Esta desarrollado con Spring Boot v4.0.1 que gestiona un sistema de inventario completo. Incluye funcionalidades como:

•	Autenticación y usuarios (AuthController, UsuarioController)

•	Gestión de productos (ProductsController)

•	Categorías de productos (CategoriaController)

•	Movimientos de inventario (MovimientoController)

•	DTOs y modelos para estructurar los datos

•	Servicios y repositorios para la lógica de negocio y acceso a datos

•	Configuración centralizada y manejo de excepciones


Tecnologías clave:

•	Spring Boot 4.0.1

•	Spring Data JPA

•	Maven como gestor de dependencias

•	Java 25


Desarrollo Frontend

Este proyecto es una aplicación de gestión de inventario desarrollada con Angular, utilizando la funcionalidad moderna de Signals (señales) introducida en Angular 16+ para el manejo reactivo del estado. La aplicación sigue una arquitectura modular y organizada por funcionalidades, con una clara separación de responsabilidades.

Características principales:

•	Arquitectura modular: Separación clara en módulos core, features (como productos-form, productos-list, usuario-list, login) y shared.

•	Estado reactivo con Signals: Uso de @angular/core versión 22.1.0 o superior, lo que permite manejar el estado de la aplicación de manera más eficiente y declarativa.

•	Enrutamiento modular: Configuración de rutas mediante app-routing.module.ts.

•	Estilos escalables: Uso de styles.css y temas personalizables.

•	Integración con Angular Material: Para componentes de interfaz de usuario consistentes y accesibles.

•	Servidor de desarrollo y producción: Scripts configurados para desarrollo local (ng serve) y despliegue (ng build).

Estructura destacada:

•	src/app/features/: Contiene módulos específicos de funcionalidad.

•	src/app/core/: Servicios y componentes globales.

•	src/app/shared/: Componentes reutilizables.

•	environments/: Configuraciones para distintos entornos.


Scripts principales (package.json):

•	start: Inicia el servidor de desarrollo.

•	build: Compila para producción.

•	test: Ejecuta pruebas unitarias.

La base de datos utilizada es PostgresQL. Se creo la base de datos inventory_db con sus 4 tablas (usuarios, productos, categoría, movimiento)
