20/06/26

- Añadido contador de rachas (streaks) en las tarjetas de hábitos para incentivar la constancia del usuario.

- Implementado un sistema de ordenación (flechas arriba/abajo) para permitir priorizar la lista principal de hábitos.

- Implementado soporte de internacionalización (i18n) con selector de idiomas en los ajustes.

- Añadido un sistema de logros desbloqueables basado en hitos de rachas y días totales para fomentar la retención.

- Refactorización de la arquitectura (Clean Code): extracción de datos estáticos y diccionarios a una carpeta constants/ para separar la lógica de la configuración.

- Refactorización de la UI: Extracción de las ventanas modales (Ajustes y Añadir Hábito) a componentes de React independientes (components/modals/) para mejorar la escalabilidad y legibilidad.

- Corrección de UI en el perfil: implementado CSS Grid para el listado de logros eliminando desbordamientos visuales y scroll innecesario.

- Corrección de clipping visual en la vitrina de logros ajustando los márgenes del contenedor con scroll para que los multiplicadores no se corten.

21/06/26

- Expandido el sistema de logros en tres verticales de gamificación: Serie de Rachas consecutivas, Serie de Constancia a largo plazo y Serie de Productividad Diaria.

- Refactorizada la función evaluadora para soportar tanto insignias acumulables por hábito como insignias globales de cuenta.

- Migración a Arquitectura Full-Stack Serverless: Despliegue exitoso del backend en Vercel con integración completa de MongoDB Atlas, eliminando la dependencia del almacenamiento local del navegador.

- Sistema de Autenticación Segura (JWT): Implementación de endpoints de registro e inicio de sesión con encriptación de contraseñas mediante bcryptjs y gestión de sesiones mediante JSON Web Tokens.

- Implementación de Privacidad de Datos: Configuración de un middleware de seguridad (protect) que aísla los datos por usuario, garantizando que cada cuenta acceda exclusivamente a sus propios hábitos.

- UX de Autenticación Dual: Optimización del flujo de entrada permitiendo el acceso mediante email o nombre de usuario indistintamente.

- Persistencia y Seguridad de Sesión: Integración de AuthContext en React para la gestión del estado global del usuario, incluyendo manejo seguro del localStorage y rutas protegidas (bloqueo automático de acceso no autorizado).

- Robustez de Interfaz (Anti-Crash): Blindaje completo del Frontend mediante el uso de encadenamiento opcional (?.) y comprobación de tipos (Array.isArray), eliminando los errores de "pantalla blanca" ante fallos de red o datos corruptos.

- Arquitectura de Datos (Refactorización de IDs): Estandarización de identificadores unificando _id (MongoDB) e id (Local) para resolver problemas de duplicación de eventos y errores de renderizado en el mapa de calor.

22/06/26

- Migración de Estructura de Datos: Evolución del modelo de historial de hábitos (tanto en MongoDB como en el estado de React), pasando de un Array estático y limitado (365 posiciones booleanas) a un Diccionario/Mapa de fechas exactas ({ "YYYY-MM-DD": boolean }). Esto elimina la restricción de un año de uso y convierte la aplicación en un trackeador temporalmente infinito.

- Motor de Tiempo Real: Implementación de utilidades de fecha (formatDate, getTodayDate, getLastNDays) para calcular el "hoy" de forma dinámica basándose en la zona horaria del usuario, eliminando los índices fijos (hardcoded) del código antiguo.

- Refactorización de Algoritmos de Estadísticas: Reescritura completa de la lógica matemática (getStreak, getTotalDays, getMaxHabitsInOneDay) para iterar y evaluar el nuevo formato de fechas. El nuevo algoritmo de rachas (getStreak) ahora retrocede en el tiempo día a día de forma precisa y cuenta con tolerancia si el hábito del día en curso aún no se ha marcado.

- Mejora de UX y UI en el Mapa de Calor: * Integración de tooltips nativos (title) en las celdas del heatmap para mostrar al usuario la fecha exacta sobre la que interactúa.

- Resolución de conflictos de diseño (layout) reajustando las clases de Tailwind (flex-shrink-0, aspect-square) para garantizar que la cuadrícula se adapte perfectamente a las vistas de Semana (7 días), Mes (30 días) y Año (365 días).

- Optimización de Componentes y Limpieza: Eliminación de fragmentos de código huérfanos en la renderización y mejora en la inyección de propiedades (props) en componentes secundarios (como ProfileModal), centralizando la lógica de estado del usuario en el padre (App.jsx).