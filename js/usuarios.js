const id = document.getElementById("id");
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const correo = document.getElementById("correo");
const puesto = document.getElementById("puesto");
const password = document.getElementById("contraseña");
const tbody = document.getElementById("tbody");    
const API_BASE_URL = 'http://localhost:8080/';
const modalTitle = document.getElementById("title-modal");
const btnSave = document.getElementById("btn-save");

myModal = new bootstrap.Modal(document.getElementById('exampleModal')); 

function obtenerUsuariosSinMetodo() {
    tbody.innerHTML = "";
    fetch('http://localhost:8080/usuario/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            return response.json();
        })
        .then(data => {
            //console.table(data);                
            let html = '';

            if (data.length > 0) {
                data.forEach(element => {
                    html += '<tr>';
                    html += '<th scope="row">' + element.id + '</th>';
                    html += '<td>' + element.nombre + '</td>';
                    html += '<td>' + element.apellido + '</td>';
                    html += '<td>' + element.email + '</td>';
                    html += '<td>' + element.puesto + '</td>';
                    html += '<td>';
                    html += '<button type="button" class="btn btn-primary me-2">Editar</button>';
                    html += '<button type="button" class="btn btn-danger">Eliminar</button>';
                    html += '</td>';
                    html += '</tr>';
                });
            } else {
                html = '<tr><td colspan="6" class="text-center">No hay usuarios</td></tr>';
            }                
            tbody.innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
            html = '<tr><td colspan="6" class="text-center">Error de coenxion</td></tr>';
            tbody.innerHTML = html;
        });
    
}

async function obtenerUsuarios() {
    let html = '';

    try {
        const response = await fetch(`${API_BASE_URL}usuario/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');                
        }

        const data = await response.json();

        if (data.length > 0) {
            data.forEach(element => {
                const userStr = encodeURIComponent(JSON.stringify(element));
                html += `
                    <tr>
                        <th scope="row">${element.id}</th>
                        <td>${element.nombre}</td>
                        <td>${element.apellido}</td>
                        <td>${element.email}</td>
                        <td>${element.puesto}</td>
                        <td>
                            <button type="button" class="btn btn-primary me-2" onclick="actualizarUsuario('${userStr}')">Editar</button>
                            <button title="${element.id}" type="button" class="btn btn-danger" onclick="eliminar(${element.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            html = `<tr><td colspan="6" class="text-center">No hay usuarios</td></tr>`;
        }

    } catch (error) {
        console.error('Error:', error);
        html = `<tr><td colspan="6" class="text-center">Error de conexión</td></tr>`;
    }

    tbody.innerHTML = html;
}

async function enviarForm(event) {
    event.preventDefault();        
    let method = 'POST';
    let point = 'usuario/'

    if (id.value != 0) {
        method = 'PUT';            
        point = 'usuario/'+id.value;
    }       

    try {
        const response = await fetch(`${API_BASE_URL}${point}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({                    
                "nombre": nombre.value,
                "apellido": apellido.value,
                "email": correo.value,
                "puesto": puesto.value,
                "password": password.value
            })
        });

        console.log(response);
        
        obtenerUsuarios();
        myModal.hide()
    } catch (error) {
        alert("Error en la conexion con la base");
    }
}

async function eliminar(id) {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmar) {
        try {
            const response = await fetch(`${API_BASE_URL}usuario/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('No se pudo eliminar al usuario');                
            }

            obtenerUsuarios()                
            myModal.hide()
            
        } catch (error) {
            alert("Error en la conexion")                
        }            
    }        
}

function actualizarUsuario(userStr) {
    const usuario = JSON.parse(decodeURIComponent(userStr));
    modalTitle.textContent = "Actualizar Usuario: " + usuario.nombre + " " + usuario.apellido;
    btnSave.textContent = "Actualizar"
    id.value = usuario.id;    
    nombre.value = usuario.nombre;
    apellido.value = usuario.apellido;
    puesto.value = usuario.puesto;
    correo.value = usuario.email;
    myModal.show();
}

function nuevoUsuario() {    
    modalTitle.textContent = "Agregar nuevo usuario";
    btnSave.textContent = "Guardar"
    id.value = 0;    
    nombre.value = "";
    apellido.value = "";
    puesto.value = "";
    correo.value = "";
    myModal.show();
}

async function loginUser(event) {
    event.preventDefault(); 

    try {
        const response = await fetch(`${API_BASE_URL}login/login`, {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({                
                "email": loginCorreo.value,                
                "password": loginPassword.value
            })
        });        

        let data = await response.json();

        if (data.status === 404 || data.status ===401 || !response.ok) {
            alert("Usuario y/o Contraseña incorrectos")
            console.table(data);            
            return false            
        }

        if (data.status === 200 || response.ok) {
            alert(data.msg)
            window.location.href = "form.html"
            
        }       
        
    } catch (error) {
        alert(error);        
    }    
}

async function registerForm(event) {    
    event.preventDefault(); 
    let method = 'POST';
    let point = 'login/register'
    try {
        const response = await fetch(`${API_BASE_URL}${point}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({                    
                "nombre": nombre.value,
                "apellido": apellido.value,
                "email": correo.value,
                "puesto": puesto.value,
                "password": password.value
            })
        });                        

        let data = await response.json()
        console.log(data);        

        if (data.status == 409 || data.status == 500) {
            alert("Usuario existente en la base");        }

        if (data.status == 200 || response.ok) {            
            window.location.href = "form.html"            
        }
    } catch (error) {
        alert("Error en la conexion con la base");
    }
}