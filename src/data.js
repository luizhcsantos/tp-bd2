const chartData = [
    { day: 'Monday', temperature: 25 },
    { day: 'Tuesday', temperature: 28 },
    { day: 'Wednesday', temperature: 22 },
    { day: 'Thursday', temperature: 24 },
    { day: 'Friday', temperature: 26 },
    { day: 'Saturday', temperature: 30 },
    { day: 'Sunday', temperature: 28 }
  ];

  const chartDataPie = [
    {
      id: "Segunda",
      label: "segunda",
      value: 25,
      color: "hsl(90, 70%, 50%)"
    },
    {
      id: "Terça",
      label: "terça",
      value: 28,
      color: "hsl(56, 70%, 50%)"
    },
    {
      id: "Quarta",
      label: "quarta",
      value: 22,
      color: "hsl(103, 70%, 50%)"
    },
    {
      id: "Quinta",
      label: "quinta",
      value: 20,
      color: "hsl(186, 70%, 50%)"
    },
    {
      id: "Sexta",
      label: "sexta",
      value: 25,
      color: "hsl(104, 70%, 50%)"
    }
  ];

  const chartDataLine = [
    {
      "id": "umidade",
      "color": "hsl(116, 70%, 50%)",
      "data": [
        { "x": "segunda", "y": 50 },
        { "x": "terça", "y": 40 },
        { "x": "quarta", "y": 41 },
        { "x": "quinta", "y": 62 },
        { "x": "sexta", "y": 51 },
        { "x": "sábado", "y": 40 },
        { "x": "domingo", "y": 38 }
      ]
    }
  ];

  const chartKeys = ['temperature'];
