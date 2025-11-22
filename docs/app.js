const chartData = {
    years: ['2022', '2023', '2024'],
    totalPais: [223, 259, 271],
    losRios: [3, 4, 5],
    porcentajePais: [1.4, 1.5, 1.9],
    incremento: [0, 1, 1]
};

const colors = Highcharts.getOptions().colors;
const categories = chartData.years;
const totalGeneral = chartData.totalPais.reduce((acc, value) => acc + value, 0);
const pieSource = [];
const browserData = [];
const versionsData = [];
const dataLen = categories.length;

let i;
let j;
let drillDataLen;
let brightness;

for (i = 0; i < dataLen; i += 1) {
    const totalYear = chartData.totalPais[i];
    const losRiosCount = chartData.losRios[i];
    const restoCount = Math.max(totalYear - losRiosCount, 0);
    const yearShare = totalGeneral ? (totalYear / totalGeneral) * 100 : 0;
    const losRiosShare = totalYear ? (losRiosCount / totalYear) * 100 : 0;
    const restoShare = Math.max(100 - losRiosShare, 0);

    pieSource.push({
        y: Number(yearShare.toFixed(2)),
        color: colors[i % colors.length],
        drilldown: {
            name: `Distribución ${categories[i]}`,
            categories: [`Los Ríos ${categories[i]}`, `Resto país ${categories[i]}`],
            data: [
                Number(losRiosShare.toFixed(2)),
                Number(restoShare.toFixed(2))
            ]
        },
        counts: [losRiosCount, restoCount],
        custom: {
            year: categories[i],
            totalChile: totalYear
        }
    });
}

for (i = 0; i < dataLen; i += 1) {
    browserData.push({
        name: categories[i],
        y: pieSource[i].y,
        color: pieSource[i].color,
        custom: pieSource[i].custom
    });

    drillDataLen = pieSource[i].drilldown.data.length;

    for (j = 0; j < drillDataLen; j += 1) {
        const name = pieSource[i].drilldown.categories[j];
        brightness = 0.2 - (j / drillDataLen) / 5;
        versionsData.push({
            name,
            y: pieSource[i].drilldown.data[j],
            color: Highcharts.color(pieSource[i].color).brighten(brightness).get(),
            custom: {
                version: name.split(' ')[1] || name.split(' ')[0],
                year: pieSource[i].custom.year,
                count: pieSource[i].counts[j],
                totalChile: pieSource[i].custom.totalChile,
                label: j === 0 ? 'Los Ríos' : 'Resto país'
            }
        });
    }
}

Highcharts.chart('container', {
    chart: { type: 'pie' },
    title: { text: 'Nº de Empresas B vinculadas al objetivo M1.1 hacia 2026' },
    plotOptions: {
        pie: {
            shadow: false,
            center: ['50%', '50%']
        }
    },
    tooltip: {
        formatter() {
            if (this.series.name === 'Participación anual') {
                const totalChile = this.point.custom?.totalChile || 0;
                return `<b>Año ${this.point.name}</b><br/>Total Chile: <b>${totalChile} empresas B</b>`;
            }

            const percentage = Highcharts.numberFormat(this.y, 1);
            const count = this.point.custom?.count || 0;
            const yearLabel = this.point.custom?.year ? ` ${this.point.custom.year}` : '';
            const label = this.point.custom?.label || this.point.name;
            return `<b>${label}${yearLabel}</b><br/>Participación: <b>${percentage}% (${count} empresas)</b>`;
        }
    },
    series: [{
        name: 'Participación anual',
        data: browserData,
        size: '45%',
        dataLabels: {
            color: '#ffffff',
            distance: '-50%'
        }
    }, {
        name: 'Detalle anual',
        data: versionsData,
        size: '80%',
        innerSize: '60%',
        dataLabels: {
            format: '<b>{point.name}:</b> {y}% ({point.custom.count} empresas)',
            filter: {
                property: 'y',
                operator: '>',
                value: 1
            },
            style: { fontWeight: 'normal' }
        },
        id: 'versions'
    }],
    credits: { enabled: false },
    responsive: {
        rules: [{
            condition: { maxWidth: 400 },
            chartOptions: {
                series: [{}, {
                    id: 'versions',
                    dataLabels: {
                        distance: 10,
                        format: '{point.custom.version}',
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 2
                        }
                    }
                }]
            }
        }]
    }
});
