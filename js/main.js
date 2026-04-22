// Archivo de scripts globales extraído de index.html

// --- Autocomplete Logic ---
function showAutocomplete() {
	document.getElementById('autocomplete-list').classList.remove('hidden');
}

function filterAutocomplete() {
	const input = document.getElementById('empresa-input').value.toUpperCase();
	const items = document.querySelectorAll('.autocomplete-item');
	items.forEach(item => {
		if (item.innerText.toUpperCase().includes(input)) {
			item.style.display = 'block';
		} else {
			item.style.display = 'none';
		}
	});
}

function selectEmpresa(val) {
	document.getElementById('empresa-input').value = val;
	document.getElementById('autocomplete-list').classList.add('hidden');
}

// --- Views Logic ---
function showView(view) {
	document.getElementById('view-search').classList.add('hidden');
	document.getElementById('view-detail').classList.add('hidden');
	if (view === 'search') document.getElementById('view-search').classList.remove('hidden');
	if (view === 'detail') document.getElementById('view-detail').classList.remove('hidden');
}

function handleSearch() {
	const tbody = document.getElementById('results-table-body');
	const productoSeleccionado = document.getElementById('filter-producto').value;
	const contratoInput = document.querySelector('input[placeholder="NRO CONTRATO"]').value.trim();
	const afiliadoInput = document.querySelector('input[placeholder="NOMBRE / DNI"]').value.trim().toLowerCase();
	let resultados = contratosData;

	// Filtro por producto
	if (productoSeleccionado && productoSeleccionado !== 'TODOS') {
		resultados = resultados.filter(item => item.producto === productoSeleccionado);
	}
	// Filtro por número de contrato
	if (contratoInput) {
		resultados = resultados.filter(item => item.contrato.includes(contratoInput));
	}

	// Filtro por afiliado o DNI
	if (afiliadoInput) {
		// Buscar contratos que tengan al menos un afiliado que coincida
		const contratosConAfiliado = new Set();
		let afiliadosEncontrados = [];
		afiliadosData.forEach(a => {
			if (
				(a.afiliado && a.afiliado.toLowerCase().includes(afiliadoInput)) ||
				(a.dni && a.dni.toLowerCase().includes(afiliadoInput))
			) {
				if (a.contra) {
					contratosConAfiliado.add(a.contra);
				}
				if (a.afiliado) {
					afiliadosEncontrados.push(a.afiliado + ' (CodTit: ' + a.codTit + ')');
				}
			}
		});
		resultados = resultados.filter(item => contratosConAfiliado.has(item.contrato));
	}

	tbody.innerHTML = resultados.map((item, idx) => {
		let contratoCell;

		if (afiliadoInput) {
			const afiliadoContrato = afiliadosData.find(a => a.contra === item.contrato && ((a.afiliado && a.afiliado.toLowerCase().includes(afiliadoInput)) || (a.dni && a.dni.toLowerCase().includes(afiliadoInput))));
			const nombreAfiliado = afiliadoContrato ? afiliadoContrato.afiliado : '';
			const codTitular = afiliadoContrato ? afiliadoContrato.codTit : '';
			contratoCell = `<td class="p-2 border-r font-bold text-blue-700 underline cursor-pointer" onclick=\"openContractModal('${item.contrato}','on', '${nombreAfiliado}', '${codTitular}')\">${item.contrato}</td>`;
		} else {
			contratoCell = `<td class="p-2 border-r font-bold text-blue-700">${item.contrato}</td>`;
		}
		return `
			<tr class="${idx % 2 !== 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 text-[11px]">
				<td class="p-2 border-r font-bold text-blue-800">${item.item}</td>
				${contratoCell}
				<td class="p-2 border-r">${item.producto}</td>
				<td class="p-2 border-r uppercase">DEL ${item.vigencia.split(' - ')[0]} AL ${item.vigencia.split(' - ')[1]}</td>
				<td class="p-2 text-center">
					<button onclick="handleSelect(${item.item})" class="bg-[#2ecc71] hover:bg-green-600 text-white px-3 py-0.5 rounded text-[10px] font-bold uppercase">SELECCIONAR</button>
				</td>
			</tr>
		`;
	}).join('');
	document.getElementById('results-section').classList.remove('hidden');
}

function handleSelect(itemIdx) {
	currentContract = contratosData.find(c => c.item === itemIdx);
	document.getElementById('detail-header-info').innerHTML = `
		<span>EMPRESA: ${currentContract.empresa}</span>
		<span>CONTRATO: ${currentContract.contrato}</span>
		<span>PRODUCTO: ${currentContract.producto}</span>
		<span>VIGENCIA: ${currentContract.vigencia}</span>
	`;
	renderCuotas();
	showView('detail');
}

function renderCuotas() {
	const tbody = document.getElementById('cuotas-table-body');
	tbody.innerHTML = cuotasData.map((c, idx) => `
		<tr class="${idx % 2 !== 0 ? 'bg-gray-100' : 'bg-white'} border-b border-gray-300 text-[10px]">
			<td class="p-2 border-r border-gray-300 text-center">${c.nro}</td>
			<td class="p-2 border-r border-gray-300 uppercase">${c.cuota}</td>
			<td class="p-2 border-r border-gray-300">${c.emision}</td>
			<td class="p-2 border-r border-gray-300">${c.vcto}</td>
			<td class="p-2 border-r border-gray-300 ${c.estado === 'PAGADO' ? 'status-pagado' : 'status-pendiente'} uppercase">${c.estado}</td>
			<td class="p-2 border-r border-gray-300 text-blue-700 underline cursor-pointer font-bold" onclick="openLiquidacionModal('${c.liquidacion}','${c.plan}')">${c.liquidacion}</td>
			<td class="p-2 border-r border-gray-300">${c.fact}</td>
			<td class="p-2 border-r border-gray-300">${c.pago}</td>
			<td class="p-2 border-r border-gray-300 text-center underline cursor-pointer font-bold" onclick="openFormaPagoModal(${JSON.stringify(c).replace(/"/g, '&quot;')})">${c.forma_pago}</td>
			<td class="p-2 border-r border-gray-300 text-blue-700 underline cursor-pointer font-bold" onclick="openComprobanteModal('${c.comprobante}')">${c.comprobante}</td>
			<td class="p-2 border-r border-gray-300 text-right font-bold">${c.monto.toFixed(2)}</td>
			<td class="p-2 text-center">
				<i class="fas fa-users text-green-600 text-lg cursor-pointer hover:text-green-800" onclick="openAfiliadosModal(${JSON.stringify(c).replace(/"/g, '&quot;')})"></i>
			</td>
		</tr>
	`).join('');
}

// --- Modal Logic ---
// (Las funciones de modales se pueden extraer aquí si son globales)
