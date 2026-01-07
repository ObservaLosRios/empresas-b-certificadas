const chartData = {
    years: ['2022', '2023', '2024'],
    totalPais: [223, 259, 271],
    losRios: [3, 4, 5],
    porcentajePais: [1.4, 1.5, 1.9]
};

// Serie temporal: solo un eje Y (conteo). El porcentaje se muestra como etiqueta sobre Los Rios.
Highcharts.chart('container', {
    chart: {
        type: 'spline',
        backgroundColor: '#ffffff',
        spacing: [16, 16, 16, 16]
    },
    title: {
        text: 'Evolucion anual de Empresas B (Chile y Los Rios)',
        style: { fontSize: '16px' }
    },
    subtitle: {
        text: 'El porcentaje de participacion de Los Rios aparece junto a cada punto naranja',
        style: { color: '#4a4a4a' }
    },
    xAxis: {
        categories: chartData.years,
        tickmarkPlacement: 'on',
        title: { text: 'Año' },
        crosshair: true
    },
    yAxis: {
        title: { text: 'Nº de Empresas B (Chile y Los Ríos)' },
        min: 0,
        allowDecimals: false,
        gridLineColor: '#e8e8e8'
    },
    tooltip: {
        shared: true,
        borderColor: '#1B4F72',
        formatter() {
            const year = this.x;
            const idx = this.points?.[0]?.point?.index ?? 0;
            const participacion = chartData.porcentajePais[idx] || 0;
            const filas = (this.points || []).map(p => {
                const valor = Highcharts.numberFormat(p.y, 0);
                return `<span style="color:${p.color}">●</span> ${p.series.name}: <b>${valor} empresas</b>`;
            }).join('<br/>');
            const lineaPct = `<span style="color:#16a085">●</span> Participación Los Ríos: <b>${Highcharts.numberFormat(participacion, 1)} %</b>`;
            return `<b>Año ${year}</b><br/>${filas}<br/>${lineaPct}`;
        }
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true,
                radius: 5,
                symbol: 'circle'
            },
            lineWidth: 3,
            states: { hover: { lineWidthPlus: 1 } }
        },
        areaspline: {
            fillOpacity: 0.08,
            lineWidth: 3
        }
    },
    series: [{
        name: 'Total Chile',
        type: 'areaspline',
        data: chartData.totalPais,
        color: '#1B4F72',
        zIndex: 3
    }, {
        name: 'Los Ríos (empresas)',
        type: 'spline',
        data: chartData.losRios,
        color: '#d35400',
        zIndex: 4,
        dataLabels: {
            enabled: true,
            formatter() {
                const idx = this.point.index;
                const pct = chartData.porcentajePais[idx] || 0;
                return `${Highcharts.numberFormat(pct, 1)}%`;
            },
            color: '#0f5132',
            backgroundColor: '#ffffff',
            borderColor: '#0f5132',
            borderRadius: 6,
            borderWidth: 1,
            padding: 4,
            style: {
                fontSize: '11px',
                fontWeight: 'bold'
            },
            y: -18,
            shadow: true
        }
    }],
    credits: { enabled: false },
    exporting: {
        enabled: true,
        buttons: {
            contextButton: {
                menuItems: [
                    'viewFullscreen',
                    'printChart',
                    'separator',
                    'downloadPNG',
                    'downloadJPEG',
                    'downloadSVG',
                    'separator',
                    'downloadCSV',
                    'downloadXLS',
                    'viewData'
                ]
            }
        }
    },
    legend: {
        itemStyle: { fontWeight: 'normal' },
        align: 'center',
        verticalAlign: 'bottom'
    },
    responsive: {
        rules: [{
            condition: { maxWidth: 640 },
            chartOptions: {
                legend: { layout: 'vertical', align: 'center', verticalAlign: 'top' },
                plotOptions: { series: { marker: { radius: 4 } } }
            }
        }]
    }
});
