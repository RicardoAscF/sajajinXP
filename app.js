    let totalXP = 0;
    const maxXP = 20000; // XP máximo para la barra de progreso

    window.onload = function() {
        loadXP();
        loadTasks('wall1'); // Cargar tareas guardadas de wall1
        loadTasks('btn-tasks'); // Cargar tareas guardadas de btn-tasks
        updateLevelDisplay();
        updateTotalXPDisplay();
        updateXPProgressBar();
        updateNextLevelDisplay(); // Llama a la función para actualizar el siguiente nivel
    };


    function resetSection(sectionId) {
        const section = document.getElementById(sectionId);
        
        // Limpiar el contenido de la sección
        section.innerHTML = ''; 

        // Eliminar las tareas guardadas en localStorage relacionadas con esta sección
        localStorage.removeItem(sectionId); 

        // Si deseas actualizar la visualización de XP y nivel, lo puedes hacer aquí también:
        updateLevelDisplay();
        updateTotalXPDisplay();
        updateXPProgressBar();
        updateNextLevelDisplay();
    }


    function resetWallButtons(wallId) {
        const wall = document.getElementById(wallId);
        
        // Limpiar el contenido de los botones de la pared (tareas agregadas)
        wall.innerHTML = ''; 

        // Eliminar las tareas guardadas en localStorage relacionadas con este muro
        localStorage.removeItem(wallId); 

        // Actualizar las visualizaciones de XP y nivel
        updateLevelDisplay();
        updateTotalXPDisplay();
        updateXPProgressBar();
        updateNextLevelDisplay();
    }

    function addXP(amount, wallId, taskName) {
        
        
        const wall = document.getElementById(wallId === 'btn-tasks' ? 'btn-tasks' : 'wall1'); 
        const block = document.createElement('div');
        
        
        // Determinar el color según el valor de XP
        block.className = 'block ' + (amount > 0 ? 'green darken-2' : 'red darken-2');

        const currentDate = new Date();
        const dateStr = currentDate.toLocaleString();

        block.innerHTML = `<strong>${taskName}</strong><br>${(amount > 0 ? '+' : '') + amount} XP<br><small>${dateStr}</small>`;
        wall.appendChild(block);

        if(wallId=='btn-tasks'){
            
        
        
        }else{
            
            totalXP += amount;
            saveXP();
        }
        
        saveTasks(wallId);

        updateLevelDisplay();
        updateTotalXPDisplay();
        updateXPProgressBar();
        updateNextLevelDisplay();
    }




    function saveTasks(wallId) {
        const wall = document.getElementById(wallId);
        const blocks = wall.getElementsByClassName('block');
        const tasks = [];

        for (let block of blocks) {
            const taskName = block.querySelector('strong').innerText;
            const xpAmount = parseInt(block.innerText.match(/([+-]?\d+) XP/)[1]);
            const date = block.querySelector('small').innerText;

            tasks.push({ taskName, xpAmount, date });
        }

        localStorage.setItem(wallId, JSON.stringify(tasks)); // Guardar tareas en localStorage
    }

    function loadTasks(wallId) {


        const tasks = JSON.parse(localStorage.getItem(wallId)) || [];

        const wall = document.getElementById(wallId); // Aquí se usará 'btn-tasks' o 'wall1'
        tasks.forEach(task => {
            const block = document.createElement('div');
            
            block.className = 'block ' + (task.xpAmount > 0 ? 'green' : 'red');



            if(wallId=='btn-tasks'){
            
                block.classList.add('pending-tasks');
                
            }else{
            
            }

            block.innerHTML = `<strong>${task.taskName}</strong><br>${(task.xpAmount > 0 ? '+' : '') + task.xpAmount} XP<br><small>${task.date}</small>`;

        
            
        
        
        
            // Agregar evento de clic para mover la tarea
            block.addEventListener('click', function() {
                moveTaskToWall1(block, task);
            });

            wall.appendChild(block);
        });

        if(wallId=='btn-tasks'){
            setClass()
            
        }
    }

    function setClass(){
        const buttons = document.querySelectorAll('.pending-tasks');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    // Agregar la clase 'pending-tasks' al bloque
                    alert('hello');

                    const element = document.querySelector('.pending-tasks');
                    const textContent = element.innerHTML.match(/\+(\d+)\sXP/);

                    const amount = textContent[1];
                
                    totalXP += parseInt(amount);
                    saveXP();
                });
            });
    }


    function moveTaskToWall1(block, task) {
        // Primero, añadimos el bloque a 'wall1'
        const wall1 = document.getElementById('wall1');
        wall1.appendChild(block);

        // Ahora, eliminamos la tarea de btn-tasks (y actualizamos el localStorage)
        removeTaskFromSection('btn-tasks', task);
        saveTasks('btn-tasks');  // Guarda los cambios en localStorage

        // Añadir la tarea a 'wall1' en localStorage
        addTaskToWall1(task);
        saveTasks('wall1'); // Guarda las tareas de 'wall1' en localStorage

        // Actualizar visualización de XP y nivel
        updateLevelDisplay();
        updateTotalXPDisplay();
        updateXPProgressBar();
        updateNextLevelDisplay();
    }

    function removeTaskFromSection(wallId, task) {
        const tasks = JSON.parse(localStorage.getItem(wallId)) || [];
        const filteredTasks = tasks.filter(t => t.taskName !== task.taskName || t.date !== task.date);
        localStorage.setItem(wallId, JSON.stringify(filteredTasks));
    }

    function addTaskToWall1(task) {
        const wall1Tasks = JSON.parse(localStorage.getItem('wall1')) || [];
        wall1Tasks.push(task);
        localStorage.setItem('wall1', JSON.stringify(wall1Tasks));
    }








    function addXPManual() {
    
        const xpInput = document.getElementById("xpInput");
        const taskNameInput = document.getElementById("taskNameInput");
        
        // Obtener el valor de XP ingresado
        const xpValue = parseInt(xpInput.value);
        // Obtener el nombre de la tarea ingresada
        const taskName = taskNameInput.value.trim();

        // Validación: si no se ingresa una cantidad válida de XP o un nombre de tarea
        if (!isNaN(xpValue) && taskName.length > 0) {
            addXP(xpValue, 'btn-tasks', taskName); // Cambiar 'wall1' por 'btn-tasks'
            xpInput.value = '';  // Limpiar el campo de XP
            taskNameInput.value = '';  // Limpiar el campo de nombre de tarea
        } else {
            showToast("Por favor, ingresa una cantidad válida de XP y un nombre para la tarea.");
        }
    }






    function startRecurrentTask(taskName, xpAmount, intervalHours) {
        const intervalMillis = intervalHours * 60 * 60 * 1000; // Convertir horas a milisegundos

        // Ejecutar inmediatamente
        addXP(xpAmount, 'wall1', taskName);

        // Repetir la tarea cada intervalo
        setInterval(function() {
            addXP(xpAmount, 'wall1', taskName);
        }, intervalMillis);
    }



    function showToast(message) {
        M.toast({html: message, classes: 'rounded'});
    }

    function saveXP() {
        localStorage.setItem('totalXP', totalXP);
    }

    function loadXP() {
        totalXP = parseInt(localStorage.getItem('totalXP')) || 0;
    }

    function resetWall(wallId) {
        const wall = document.getElementById(wallId);
        wall.innerHTML = '';  // Limpia el contenido visual del muro
        totalXP = 0;  // Resetea el total de XP
        localStorage.removeItem('totalXP');  // Limpia el almacenamiento en caché
        updateLevelDisplay(); // Actualiza la visualización del nivel
        updateTotalXPDisplay(); // Actualiza la visualización de XP total
        updateXPProgressBar(); // Actualiza la barra de progreso
        updateNextLevelDisplay(); // Actualiza la sección del siguiente nivel
    }

    function updateLevelDisplay() {
        const levelDisplay = document.getElementById('levelDisplay');
        let level = "Nivel Base"; // Cambiado de "Novato" a "Nivel Base"

        // Asignación de niveles según la cantidad de XP
        if (totalXP >= 20000) {
            level = "Super Saiyajin 3";
        } else if (totalXP >= 10000) {
            level = "Super Saiyajin 2";
        }else if (totalXP >= 5000) {
            level = "Super Saiyajin 1";
        }
        
        
        levelDisplay.textContent = "Nivel: " + level; // Actualiza la visualización del nivel
    }

    function updateTotalXPDisplay() {
        const totalXPDisplay = document.getElementById('totalXPDisplay');
        totalXPDisplay.textContent = "XP Total: " + totalXP;
    }

    function updateXPProgressBar() {
        const xpProgressBar = document.getElementById('xpProgressBar');
        const xpPercentage = document.getElementById('xpPercentage');
        const percentage = Math.min((totalXP / maxXP) * 100, 100); // Asegura que no exceda 100%
        xpProgressBar.style.width = percentage + '%';
        xpPercentage.textContent = Math.floor(percentage) + '%';
    }

    function updateNextLevelDisplay() {
        const nextLevelDisplay = document.getElementById('nextLevelDisplay');
        const nextLevelDisplayRemaining = document.getElementById('nextLevelDisplayRemaining');
        
        let nextLevelXP;
        
        if (totalXP < 5000) {
            nextLevelXP = 5000;
        } else if (totalXP < 10000) {
            nextLevelXP = 10000;
        } else if (totalXP < 20000) {
            nextLevelXP = 20000;
        } else {
            nextLevelXP = 40000; // Aquí puedes poner el siguiente umbral si lo deseas
        }
        
        nextLevelDisplay.textContent = "Siguiente Nivel: " + nextLevelXP;
        nextLevelDisplayRemaining.textContent = "Faltan: " + (nextLevelXP - totalXP) + " XP";
        
    }




const currentDate = new Date();
const currentWeek = getWeekNumber(currentDate);
console.log("Semana actual:", currentWeek);


const tasksPerWeek = 50; // Cuántas tareas se muestran por semana
const allTasks = [
    
    // ... más tareas
];




function getWeekNumber(date) {
    const tempDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    tempDate.setDate(tempDate.getDate() - tempDate.getDay() + 1); // Ajuste para lunes como primer día de la semana
    const startOfYear = new Date(tempDate.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((tempDate - startOfYear) / 86400000) + 1) / 7);
    return weekNumber;
}















const weekNumberDisplay = document.getElementById('week-number');
const wall1 = document.getElementById('wall1');

// Función para cargar las tareas de la semana
function loadTasksForWeek(week) {
    wall1.innerHTML = ''; // Limpiar tareas actuales
    const startIndex = (week - 1) * tasksPerWeek;
    const tasksForWeek = allTasks.slice(startIndex, startIndex + tasksPerWeek);

    tasksForWeek.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.textContent = task;
        wall1.appendChild(taskElement);
    });

    // Actualizar número de semana
    weekNumberDisplay.textContent = `Semana ${week}`;
}

// Función para avanzar una semana
document.getElementById('next-week').addEventListener('click', () => {
    if ((currentWeek * tasksPerWeek) < allTasks.length) {
        currentWeek++;
        loadTasksForWeek(currentWeek);
    }
});

// Función para retroceder una semana
document.getElementById('prev-week').addEventListener('click', () => {
    if (currentWeek > 1) {
        currentWeek--;
        loadTasksForWeek(currentWeek);
    }
});

// Cargar tareas de la semana inicial
loadTasksForWeek(currentWeek);

