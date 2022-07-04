swal({
    title: "Bienvenido a tu Lista de Tareas!",
    text: "Listos para completarlas a todas? Vamos!",
    icon: "success",
  });

//Ingreso Nombre de Usuario
let usuario = prompt("Ingrese su nombre");

//Saludo de Usuario en el HTML
const h1 = document.getElementsByTagName("h1")[0];
h1.innerText = `¡Bienvenido, ${usuario}!`;

//Clima
window.addEventListener('load', ()=>{
    let lon
    let lat

    let temperaturaValor = document.getElementById('temperatura-valor')
    let temperaturaDescripcion = document.getElementById('temperatura-descripcion')

    let ubicacion = document.getElementById('ubicacion')
    let iconoAnimado = document.getElementById('icono-animado')

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(posicion =>{
            //console.log(posicion.coords.latitude)
            lon = posicion.coords.longitude
            lat = posicion.coords.latitude

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&&appid=41329c27b887c5952c88c9fff7d83655`
            //console.log(url)
            
            //fetch Clima
            fetch(url)
                .then(response => {return response.json()})
                .then ( data => {
                    
                    let temp = Math.round(data.main.temp);
                    temperaturaValor.textContent=`${temp}°C`
                    
                    let desc = data.weather[0].description
                    temperaturaDescripcion.textContent = desc.toUpperCase()
                    
                    ubicacion.textContent = data.name

                    //icono clima
                    console.log(data.weather[0].main)
                    switch(data.weather[0].main){
                        case `Thunderstorm`:
                            iconoAnimado.src = `./img/animated/rainy-2.svg`
                            console.log(`TORMENTA`);
                            break;
                        case `Drizzle`:
                            iconoAnimado.src = `./img/animated/thunder.svg`
                            console.log(`LLOVIZNA`);
                            break;
                        case `Rain`:
                            iconoAnimado.src = `./img/animated/rainy-7.svg`
                            console.log(`LLUVIA`);
                            break;
                        case `Snow`:
                            iconoAnimado.src = `./img/animated/snowy-6.svg`
                            console.log(`NIEVE`);
                            break;
                        case `Clear`:
                            iconoAnimado.src = `./img/animated/day.svg`
                            console.log(`LIMPIO`);
                            break;
                        case `Atmosphere`:
                            iconoAnimado.src = `./img/animated/weather.svg`
                            console.log(`ATMOSFERA`);
                            break;
                        case `Clouds`:
                            iconoAnimado.src = `./img/animated/cloudy-day-1.svg`
                            console.log(`NUBES`);
                            break;
                        default:
                            iconoAnimado.src = `./img/animated/cloudy-day-1.svg`
                            console.log(`por defecto`)
                }
                })
                .catch(error =>{
                    console.log(error)
                })

        })
    }
})

//variables

const fecha = document.querySelector('#fecha');
const lista = document.querySelector('#lista');
const input = document.querySelector('#input');
const botonEnter = document.querySelector('#enter');
const check = 'fa-check-circle';
const uncheck = 'fa-circle';
const lineThrough = 'line-through';
let id
let LIST

//fecha

const FECHA = new Date()
fecha.innerHTML=FECHA.toLocaleDateString('es-AR',{weekday:'long',month:'short',day:'numeric'})

//Funciones

//Funcion Agregar Tarea

function agregarTarea (tarea,id,realizado,eliminado){

    if(eliminado){return}

    const REALIZADO = realizado ?check :uncheck
    const LINE = realizado ?lineThrough :''

    const elemento =    `
                            <li id="elemento">
                            <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
                            <p class="text ${LINE}">${tarea}</p>
                            <i class="fas fa-trash de" data="eliminado" id="${id}"></i>
                            </li>
                        `
    lista.insertAdjacentHTML("beforeend",elemento)
}

//funcion tarea eliminada

function tareaEliminada (element){
    element.parentNode.parentNode.removeChild(element.parentNode)
    LIST[element.id].eliminado = true
}

//funcion tarea realizada

function tareaRealizada(element){
    element.classList.toggle(check)
    element.classList.toggle(uncheck)
    element.parentNode.querySelector('.text').classList.toggle(lineThrough)
    LIST[element.id].realizado = LIST[element.id].realizado ?false :true
}

botonEnter.addEventListener('click',()=> {
    const tarea =input.value;
    if (tarea) {
        agregarTarea(tarea,id,false,false)
        LIST.push({
            nombre: tarea,
            id:id,
            realizado: false,
            eliminado:false
    })
    }
    localStorage.setItem('TODO',JSON.stringify(LIST))
    input.value=''
    id++
})

document.addEventListener('keyup',function(event){
    if(event.key=='Enter'){
        const tarea = input.value;
        if (tarea) {
            agregarTarea(tarea,id,false,false)
            LIST.push({
                nombre: tarea,
                id:id,
                realizado: false,
                eliminado:false
        })
        }
        localStorage.setItem('TODO',JSON.stringify(LIST))
        input.value=''
        id++        
    }
})

lista.addEventListener('click',function(event){
    const element = event.target
    const elementData = element.attributes.data.value
    if(elementData==='realizado'){
        tareaRealizada(element)
    }
    else if (elementData==='eliminado'){
        tareaEliminada(element)
    }
    localStorage.setItem('TODO',JSON.stringify(LIST))
})

//LOCALSTORAGE-GET ITEM

let data = localStorage.getItem('TODO')
if(data){
    LIST=JSON.parse(data)
    id=LIST.length
    cargarLista(LIST)
}else {
    LIST = []
    id=0
    swal({
        icon: "success",
      });
}

function cargarLista(DATA){
    DATA.forEach(function(i) {
        agregarTarea(i.nombre,i.id,i.realizado,i.eliminado)
    })
}

