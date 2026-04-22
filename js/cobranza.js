// Archivo de scripts específicos para cobranza.html

// --- Lógica de navegación ---
document.addEventListener('DOMContentLoaded', function() {
	var indexLink = document.getElementById('index-link');
	if (indexLink) {
		indexLink.onclick = function() {
			window.location.href = 'index.html';
		};
	}
});

// --- Aquí puedes agregar la lógica específica de cobranza ---
