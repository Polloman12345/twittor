//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [ //todo lo que es el corazon de mi aplicacion. el core que es fijo y siempre necesario
    // "/",
    "index.html",
    "css/style.css",
    "img/favicon.ico",
    "img/avatars/hulk.jpg",
    "img/avatars/ironman.jpg",
    "img/avatars/spiderman.jpg",
    "img/avatars/thor.jpg",
    "img/avatars/wolverine.jpg",
    "js/app.js",
]

const APP_SHELL_INMUTABLE = [ //librerias y cosas así que nunca se van a modificar
    "https://fonts.googleapis.com/css?family=Quicksand:300,400",
    "https://fonts.googleapis.com/css?family=Lato:400,300",
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "css/animate.css",
    "js/libs/jquery.js",

]

self.addEventListener("install", event => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL))
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE))

    event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
})

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );
});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then( response => {

        if(response)
        {
            return response;
        }
//console.log(e.request.url);
        return fetch(e.request).then(newResponse => {

            return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResponse);

        });

    });

    e.respondWith( respuesta );
});