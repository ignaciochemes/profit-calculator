import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Information = () => {
    const salesData = [
        { name: 'Ene', ventas: 4000, ganancias: 2400 },
        { name: 'Feb', ventas: 3000, ganancias: 1398 },
        { name: 'Mar', ventas: 2000, ganancias: 9800 },
        { name: 'Abr', ventas: 2780, ganancias: 3908 },
        { name: 'May', ventas: 1890, ganancias: 4800 },
        { name: 'Jun', ventas: 2390, ganancias: 3800 },
    ];

    const productData = [
        { name: 'Producto A', ventas: 4000 },
        { name: 'Producto B', ventas: 3000 },
        { name: 'Producto C', ventas: 2000 },
        { name: 'Producto D', ventas: 2780 },
        { name: 'Producto E', ventas: 1890 },
    ];

    const categorySalesData = [
        { name: 'Electrónicos', value: 400 },
        { name: 'Ropa', value: 300 },
        { name: 'Alimentos', value: 300 },
        { name: 'Libros', value: 200 },
    ];

    const monthlyProfitData = [
        { name: 'Ene', ganancias: 4000 },
        { name: 'Feb', ganancias: 3000 },
        { name: 'Mar', ganancias: 5000 },
        { name: 'Abr', ganancias: 2780 },
        { name: 'May', ganancias: 1890 },
        { name: 'Jun', ganancias: 2390 },
    ];

    return (
        <Container fluid className="py-4">
            <h1 className="text-center mb-4">Dashboard de Información</h1>
            <Row>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Ventas y Ganancias Mensuales</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="ventas" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="ganancias" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Ventas por Producto</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={productData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ventas" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Distribución de Ventas por Categoría</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie dataKey="value" isAnimationActive={false} data={categorySalesData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Tendencia de Ganancias Mensuales</Card.Title>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyProfitData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="ganancias" stroke="#82ca9d" fill="#82ca9d" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Information;