import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        isActive: true,
        cost: '',
        costUsd: '',
        sellingPrice: '',
        sellingPriceUsd: '',
        applyIva: false,
        ivaPercentage: ''
    });
    const [usdToArsRate, setUsdToArsRate] = useState(1300);
    const [costInArs, setCostInArs] = useState('');
    const [sellingPriceInArs, setSellingPriceInArs] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleIvaSwitch = (checked) => {
        if (product.sellingPrice || product.sellingPriceUsd) {
            setProduct(prevProduct => ({
                ...prevProduct,
                applyIva: checked,
                ivaPercentage: checked ? prevProduct.ivaPercentage || '21' : ''
            }));
        }
    };

    const calculateFinalSellingPrice = () => {
        let basePrice = parseFloat(product.sellingPrice) || 0;
        if (product.applyIva && product.ivaPercentage) {
            const ivaAmount = basePrice * (parseFloat(product.ivaPercentage) / 100);
            basePrice += ivaAmount;
        }
        return basePrice.toFixed(2);
    };

    const handleRateChange = (e) => {
        const newRate = e.target.value;
        setUsdToArsRate(newRate);
    };

    const calculateCostInArs = (costUsd) => {
        return (parseFloat(costUsd) * usdToArsRate).toFixed(2);
    };

    const calculateSellingPriceInArs = (sellingPriceUsd) => {
        return (parseFloat(sellingPriceUsd) * usdToArsRate).toFixed(2);
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
            sellingPrice: Number(calculateFinalSellingPrice()),
            sellingPriceUsd: Number(product.sellingPriceUsd)
        };

        fetch(`${import.meta.env.VITE_API_URL}/product`, {
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
                setToastMessage('Producto creado exitosamente!');
                setShowToast(true);
                setProduct({ name: '', cost: '', costUsd: '', sellingPrice: '', sellingPriceUsd: '', applyIva: false, ivaPercentage: '' });
                setCostInArs('');
                setSellingPriceInArs('');
            })
            .catch((error) => {
                console.error('Error:', error);
                setToastMessage('Error al crear el producto. Por favor, intente nuevamente.');
                setShowToast(true);
            });
    };

    const ivaTooltip = (
        <Tooltip id="iva-tooltip">
            Para habilitar el IVA, primero ingrese un precio de venta en ARS o USD.
        </Tooltip>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Container className="py-4">
                <h1 className="text-center mb-4">Crear nuevo producto</h1>
                <Row>
                    <Col md={8} className="mx-auto">
                        <Card className="shadow mb-4">
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
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={ivaTooltip}
                                                trigger={['hover', 'focus']}
                                            >
                                                <div>
                                                    <Form.Check
                                                        type="switch"
                                                        id="iva-switch"
                                                        label="Aplicar IVA"
                                                        checked={product.applyIva}
                                                        onChange={(e) => handleIvaSwitch(e.target.checked)}
                                                        disabled={!product.sellingPrice && !product.sellingPriceUsd}
                                                    />
                                                </div>
                                            </OverlayTrigger>
                                        </Col>
                                        {product.applyIva && (
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Porcentaje de IVA</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        name="ivaPercentage"
                                                        value={product.ivaPercentage}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}
                                    </Row>
                                    {product.applyIva && product.sellingPrice && (
                                        <p>Precio final con IVA: {calculateFinalSellingPrice()} ARS</p>
                                    )}
                                    <div className="mt-auto">
                                        <Button variant="primary" type="submit">
                                            Crear Producto
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={8} className="mx-auto">
                        <Card className="shadow">
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

            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    minWidth: '250px'
                }}
            >
                <Toast.Header>
                    <strong className="me-auto">Notificación</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default CreateProduct;