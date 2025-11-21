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
    const yearShare = totalGeneral ? (totalYear / totalGeneral) * 100 : 0;
    const losRiosShare = totalYear ? (chartData.losRios[i] / totalYear) * 100 : 0;
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
        }
    });
}

for (i = 0; i < dataLen; i += 1) {
    browserData.push({
        name: categories[i],
        y: pieSource[i].y,
        color: pieSource[i].color
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
                version: name.split(' ')[1] || name.split(' ')[0]
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
    tooltip: { valueSuffix: '%' },
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
            format: '<b>{point.name}:</b> <span style="opacity: 0.5">{y}%</span>',
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
