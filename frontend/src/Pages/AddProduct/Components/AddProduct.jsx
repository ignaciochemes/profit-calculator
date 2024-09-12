import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        isActive: true,
        cost: '',
        costUsd: '',
        sellingPrice: '',
        sellingPriceUsd: ''
    });
    const [usdToArsRate, setUsdToArsRate] = useState(1300);
    const [costInArs, setCostInArs] = useState('');
    const [sellingPriceInArs, setSellingPriceInArs] = useState('');
    const [feedback, setFeedback] = useState(null);

    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const calculateCostInArs = (costUsd) => {
        return (costUsd * usdToArsRate).toFixed(2);
    };

    const calculateSellingPriceInArs = (sellingPriceUsd) => {
        return (sellingPriceUsd * usdToArsRate).toFixed(2);
    };

    const handleRateChange = (e) => {
        const newRate = e.target.value;
        setUsdToArsRate(newRate);
    };

    const handleCalculateSellingPriceInArs = (e) => {
        const sellingPriceUsd = parseFloat(e.target.value) || 0;
        setSellingPriceInArs(calculateSellingPriceInArs(sellingPriceUsd));
    };

    const handleCalculateCostInArs = (e) => {
        const costUsd = parseFloat(e.target.value) || 0;
        setCostInArs(calculateCostInArs(costUsd));
    };

    useEffect(() => {
        setCostInArs(calculateCostInArs(parseFloat(product.costUsd) || 0));
        setSellingPriceInArs(calculateSellingPriceInArs(parseFloat(product.sellingPriceUsd) || 0));
    }, [usdToArsRate, product.costUsd, product.sellingPriceUsd]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let readyProduct = {
            name: product.name,
            isActive: product.isActive,
            cost: Number(product.cost),
            costUsd: Number(product.costUsd),
            sellingPrice: Number(product.sellingPrice),
            sellingPriceUsd: Number(product.sellingPriceUsd)
        };

        fetch('http://localhost:33000/api/v1/carta-online/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
            },
            body: JSON.stringify(readyProduct),
        })
            .then(response => response.json())
            .then(data => {
                if (data?.statusCode === 401) {
                    window.location.href = '/signin';
                    return;
                }
                console.log('Product created successfully:', data);
                setFeedback({ type: 'success', message: 'Producto creado exitosamente!' });
                setProduct({ name: '', cost: '', costUsd: '', sellingPrice: '', sellingPriceUsd: '' });
                setCostInArs('');
                setSellingPriceInArs('');
            })
            .catch((error) => {
                console.error('Error:', error);
                setFeedback({ type: 'danger', message: 'Error al crear el producto. Por favor, intente nuevamente.' });
            });
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Crear nuevo producto</h1>
            {feedback && (
                <Alert variant={feedback.type} onClose={() => setFeedback(null)} dismissible>
                    {feedback.message}
                </Alert>
            )}
            <Row>
                <Col md="8">
                    <Card className="mb-4">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Producto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={product.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Costo en ARS</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="cost"
                                                value={product.cost}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Costo en USD</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="any"
                                                name="costUsd"
                                                value={product.costUsd}
                                                onChange={(e) => {
                                                    handleInputChange(e);
                                                    handleCalculateCostInArs(e);
                                                }}
                                            />
                                            <Form.Text className="text-muted">
                                                Costo en ARS: {costInArs}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Precio de venta en ARS</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="any"
                                                name="sellingPrice"
                                                value={product.sellingPrice}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Precio de venta en USD</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="any"
                                                name="sellingPriceUsd"
                                                value={product.sellingPriceUsd}
                                                onChange={(e) => {
                                                    handleInputChange(e);
                                                    handleCalculateSellingPriceInArs(e);
                                                }}
                                            />
                                            <Form.Text className="text-muted">
                                                Precio de Venta en ARS: {sellingPriceInArs}
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">
                                    Crear Producto
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Calculadora de Conversión</Card.Title>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Cambio USD a ARS</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    value={usdToArsRate}
                                    onChange={handleRateChange}
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateProduct;