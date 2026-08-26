const btnAdicionar = document.getElementById("btnAdicionar");
const listaNotas = document.getElementById("listaNotas");

const contadorPaginas = document.getElementById("contadorPaginas");

const modal = document.getElementById("modal");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");
const btnSalvar = document.getElementById("btnSalvar");

const inputTitulo = document.getElementById("inputTitulo");
const inputTexto = document.getElementById("inputTexto");

const modalTitulo = document.getElementById("modalTitulo");

const toastContainer = document.getElementById("toastContainer");


// ==============================
// CONFIGURAÇÕES
// ==============================

const LIMITE_PAGINAS = 6;

const CHAVE_STORAGE = "quickNotes";

let notaEditando = null;


// ==============================
// CARREGAR NOTAS
// ==============================

let notas = JSON.parse(
    localStorage.getItem(CHAVE_STORAGE)
) || [];


// ==============================
// SALVAR NO LOCALSTORAGE
// ==============================

function salvarNotas() {

    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(notas)
    );

}


// ==============================
// RENDERIZAR NOTAS
// ==============================

function renderizarNotas() {

    listaNotas.innerHTML = "";

    notas.forEach((nota) => {

        criarNotaElemento(nota);

    });

    atualizarContador();

}


// ==============================
// ATUALIZAR CONTADOR
// ==============================

function atualizarContador() {

    contadorPaginas.textContent =
        `${notas.length} / ${LIMITE_PAGINAS} pages`;

}


// ==============================
// ABRIR MODAL
// ==============================

function abrirModal() {

    modal.classList.add("aberto");

    setTimeout(() => {

        inputTitulo.focus();

    }, 200);

}


// ==============================
// FECHAR MODAL
// ==============================

function fecharModal() {

    modal.classList.remove("aberto");

    notaEditando = null;

}


// ==============================
// BOTÃO +
// ==============================

btnAdicionar.addEventListener(
    "click",
    function () {

        // Verificar limite

        if (notas.length >= LIMITE_PAGINAS) {

            mostrarToast(
                "Your notebook is full. Max 6 notes.",
                "error"
            );

            return;
        }


        // Modo criação

        notaEditando = null;

        modalTitulo.textContent =
            "Create New Note";

        btnSalvar.innerHTML = `
            <i class="fa-solid fa-plus"></i>
            Criar nota
        `;


        inputTitulo.value = "";
        inputTexto.value = "";


        abrirModal();

    }
);


// ==============================
// FECHAR MODAL
// ==============================

btnFecharModal.addEventListener(
    "click",
    fecharModal
);

btnCancelar.addEventListener(
    "click",
    fecharModal
);


// ==============================
// CLICAR FORA DO MODAL
// ==============================

modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {

            fecharModal();

        }

    }
);


// ==============================
// ESC FECHA MODAL
// ==============================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("aberto")
        ) {

            fecharModal();

        }

    }
);


// ==============================
// SALVAR / CRIAR / EDITAR
// ==============================

btnSalvar.addEventListener(
    "click",
    function () {

        const titulo =
            inputTitulo.value.trim();

        const texto =
            inputTexto.value.trim();


        // ==========================
        // VALIDAR TÍTULO
        // ==========================

        if (titulo === "") {

            mostrarToast(
                "Give your note a title!",
                "error"
            );

            inputTitulo.focus();

            return;
        }


        // ==========================
        // VALIDAR TEXTO
        // ==========================

        if (texto === "") {

            mostrarToast(
                "Give your note a content!",
                "error"
            );

            inputTexto.focus();

            return;
        }


        // ==========================
        // EDITAR
        // ==========================

        if (notaEditando !== null) {

            const nota = notas.find(
                item => item.id === notaEditando
            );


            if (nota) {

                nota.titulo = titulo;

                nota.texto = texto;

            }


            salvarNotas();

            renderizarNotas();

            fecharModal();


            mostrarToast(
                "Note changed!",
                "success!"
            );


            return;
        }


        // ==========================
        // CRIAR
        // ==========================

        const novaNota = {

            id: Date.now(),

            titulo: titulo,

            texto: texto

        };


        notas.push(novaNota);


        salvarNotas();

        renderizarNotas();

        fecharModal();


        mostrarToast(
            "Note created!",
            "success"
        );

    }
);


// ==============================
// CRIAR ELEMENTO DA NOTA
// ==============================

function criarNotaElemento(nota) {

    const elemento =
        document.createElement("article");

    elemento.classList.add("nota");


    // ==========================
    // HEADER
    // ==========================

    const header =
        document.createElement("header");

    header.classList.add(
        "nota-header"
    );


    // ==========================
    // TÍTULO
    // ==========================

    const titulo =
        document.createElement("h2");

    titulo.textContent =
        nota.titulo;


    // ==========================
    // AÇÕES
    // ==========================

    const acoes =
        document.createElement("div");

    acoes.classList.add("acoes");


    // ==========================
    // BOTÃO EDITAR
    // ==========================

    const btnEditar =
        document.createElement("button");

    btnEditar.classList.add(
        "btn",
        "btn-editar"
    );

    btnEditar.title =
        "Edit note";

    btnEditar.innerHTML = `
        <i class="fa-solid fa-pen"></i>
    `;


    // ==========================
    // BOTÃO EXCLUIR
    // ==========================

    const btnExcluir =
        document.createElement("button");

    btnExcluir.classList.add(
        "btn",
        "btn-excluir"
    );

    btnExcluir.title =
        "Delete note";

    btnExcluir.innerHTML = `
        <i class="fa-solid fa-trash"></i>
    `;


    // ==========================
    // TEXTO
    // ==========================

    const texto =
        document.createElement("p");

    texto.textContent =
        nota.texto;


    // ==========================
    // MONTAR
    // ==========================

    acoes.appendChild(btnEditar);

    acoes.appendChild(btnExcluir);

    header.appendChild(titulo);

    header.appendChild(acoes);

    elemento.appendChild(header);

    elemento.appendChild(texto);

    listaNotas.appendChild(elemento);


    // ==========================
    // EDITAR
    // ==========================

    btnEditar.addEventListener(
        "click",
        function () {

            abrirEdicao(nota);

        }
    );


    // ==========================
    // EXCLUIR
    // ==========================

    btnExcluir.addEventListener(
        "click",
        function () {

            excluirNota(
                nota.id,
                elemento
            );

        }
    );

}


// ==============================
// ABRIR EDIÇÃO
// ==============================

function abrirEdicao(nota) {

    notaEditando = nota.id;


    modalTitulo.textContent =
        "Edit note";


    btnSalvar.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Save changes
    `;


    inputTitulo.value =
        nota.titulo;

    inputTexto.value =
        nota.texto;


    abrirModal();

}


// ==============================
// EXCLUIR NOTA
// ==============================

function excluirNota(id, elemento) {

    elemento.style.opacity = "0";

    elemento.style.transform =
        "scale(0.9)";


    setTimeout(() => {

        // Remover do array

        notas = notas.filter(
            nota => nota.id !== id
        );


        // Salvar nova lista

        salvarNotas();


        // Atualizar tela

        renderizarNotas();

    }, 200);


    mostrarToast(
        "Note deleted.",
        "error"
    );

}


// ==============================
// TOAST
// ==============================

function mostrarToast(
    mensagem,
    tipo = "normal"
) {

    const toast =
        document.createElement("div");


    toast.classList.add("toast");


    // Tipo

    if (tipo === "success") {

        toast.classList.add(
            "success"
        );

    }


    if (tipo === "error") {

        toast.classList.add(
            "error"
        );

    }


    // Ícone

    let icone =
        "fa-note-sticky";


    if (tipo === "success") {

        icone =
            "fa-circle-check";

    }


    if (tipo === "error") {

        icone =
            "fa-circle-exclamation";

    }


    // Conteúdo

    toast.innerHTML = `
        <i class="fa-solid ${icone}"></i>
        <span>${mensagem}</span>
    `;


    toastContainer.appendChild(toast);


    // Remover depois de 2.5 segundos

    setTimeout(() => {

        toast.style.animation =
            "desaparecer 0.3s ease";


        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}


// ==============================
// INICIALIZAÇÃO
// ==============================

renderizarNotas();