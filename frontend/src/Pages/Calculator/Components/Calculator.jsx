import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Button, ListGroup, Container, Row, Col, Card, Alert, Pagination, Table } from 'react-bootstrap';
import { formatCurrencyArs } from '../../../Utils/CurrencyFormatter';
import { findAllProductsWebService, saveProfitHistoryWebService } from '../../../Webservices/DahsboardWebServices';

const ProfitCalculator = () => {
    const [products, setProducts] = useState([]);
    const [existingProducts, setExistingProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(6);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const maxDisplayedProducts = 5;

    const handleSearchChange = useCallback((e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
        setSelectedProduct(null);

        if (searchValue.length >= 2) {
            const filtered = existingProducts
                .filter(product => product.name.toLowerCase().includes(searchValue))
                .slice(0, maxDisplayedProducts);
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [existingProducts]);

    const handleSelectProduct = useCallback((product) => {
        setSelectedProduct({ ...product, quantity: 1 });
        setSearchTerm(product.name);
    }, []);

    const handleAddProduct = useCallback(() => {
        if (selectedProduct) {
            setProducts([...products, { ...selectedProduct, id: Date.now() }]);
            setSelectedProduct(null);
            setSearchTerm('');
            setCurrentPage(Math.ceil((products.length + 1) / productsPerPage));
        }
    }, [products, selectedProduct, productsPerPage]);

    const handleQuantityChange = useCallback((e) => {
        setSelectedProduct((prevProduct) => {
            if (!prevProduct) {
                return null;
            }
            return { ...prevProduct, quantity: e.target.value };
        });
    }, []);

    const handleRemoveProduct = useCallback((id) => {
        setProducts(products.filter(product => product.id !== id));
    }, [products]);

    const calculateProfit = useCallback((costPrice, salePrice, quantity) => {
        if (!costPrice || !salePrice || !quantity) {
            return 0;
        }
        return (parseFloat(salePrice) - parseFloat(costPrice)) * parseInt(quantity);
    }, []);

    const totalProfit = useMemo(() => {
        return products.reduce((acc, product) => {
            return acc + calculateProfit(product.cost, product.sellingPrice, product.quantity);
        }, 0).toFixed(2);
    }, [products, calculateProfit]);

    const handleSave = useCallback(async () => {
        if (!products.length) {
            setFeedback({ type: 'danger', message: 'No hay productos para guardar.' });
            return;
        }
        const productUuids = products.flatMap(product =>
            Array(parseInt(product.quantity)).fill(product.uuid)
        );
        const data = {
            profit: parseFloat(totalProfit),
            productsUuid: productUuids,
        };
        try {
            await saveProfitHistoryWebService(data, sessionStorage.getItem('refreshToken'));
            setFeedback({ type: 'success', message: 'Cálculo de ganancia guardado exitosamente.' });
            setProducts([]);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error saving profit history:', error);
            setFeedback({ type: 'danger', message: 'Error al guardar el cálculo de ganancia. Por favor, intente nuevamente.' });
        }

    }, [products, totalProfit]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

    const calculateQuickStats = useCallback(() => {
        const totalProducts = products.reduce((sum, product) => sum + parseInt(product.quantity), 0);
        const totalCost = products.reduce((sum, product) => sum + (parseFloat(product.cost) * parseInt(product.quantity)), 0);
        const totalRevenue = products.reduce((sum, product) => sum + (parseFloat(product.sellingPrice) * parseInt(product.quantity)), 0);
        const totalProfit = totalRevenue - totalCost;
        const averageProfit = totalProducts > 0 ? totalProfit / totalProducts : 0;
        const profitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

        return {
            totalProducts,
            totalCost: formatCurrencyArs(totalCost),
            totalRevenue: formatCurrencyArs(totalRevenue),
            averageProfit: formatCurrencyArs(averageProfit),
            profitPercentage: profitPercentage.toFixed(2)
        };
    }, [products]);

    const quickStats = useMemo(() => calculateQuickStats(), [calculateQuickStats]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await findAllProductsWebService(sessionStorage.getItem('refreshToken'));
                setExistingProducts(products);
            } catch (error) {
                console.error('Error fetching products:', error);
                setFeedback({ type: 'danger', message: 'Error al cargar los productos. Por favor, intente nuevamente.' });
            }
        };
        fetchProducts();
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Container fluid className="py-4">
                <h1 className="text-center mb-4">Calculadora de Ganancias</h1>
                {feedback && (
                    <Alert variant={feedback.type} onClose={() => setFeedback(null)} dismissible>
                        {feedback.message}
                    </Alert>
                )}
                <Row className="g-4">
                    <Col lg={4}>
                        <Card className="shadow mb-4">
                            <Card.Body>
                                <Card.Title>Buscar y Agregar Productos</Card.Title>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar producto por nombre (mínimo 2 caracteres)"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </Form.Group>
                                {filteredProducts.length > 0 && (
                                    <ListGroup className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {filteredProducts.map(product => (
                                            <ListGroup.Item
                                                key={product.uuid}
                                                action
                                                onClick={() => handleSelectProduct(product)}
                                            >
                                                {product.name}
                                            </ListGroup.Item>
                                        ))}
                                        {filteredProducts.length === maxDisplayedProducts && (
                                            <ListGroup.Item disabled>
                                                Mostrando los primeros {maxDisplayedProducts} resultados. Refine su búsqueda para ver más.
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                )}
                                {selectedProduct && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Cantidad</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={selectedProduct.quantity}
                                            onChange={handleQuantityChange}
                                        />
                                    </Form.Group>
                                )}
                                <Button variant="primary" onClick={handleAddProduct} disabled={!selectedProduct}>
                                    Agregar Producto
                                </Button>
                            </Card.Body>
                        </Card>
                        <Card className="shadow">
                            <Card.Body>
                                <Card.Title>Estadísticas Rápidas</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <strong>Total de Productos:</strong> {quickStats.totalProducts}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Costo Total:</strong> {quickStats.totalCost}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Ingreso Total:</strong> {quickStats.totalRevenue}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Ganancia Promedio por Producto:</strong> {quickStats.averageProfit}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Porcentaje de Ganancia:</strong> {quickStats.profitPercentage}%
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Card className="shadow h-100">
                            <Card.Body>
                                <Card.Title>Productos Seleccionados</Card.Title>
                                <div style={{ height: '400px', overflowY: 'auto' }}>
                                    <Table hover responsive>
                                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa' }}>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Cantidad</th>
                                                <th>Costo</th>
                                                <th>Precio</th>
                                                <th>Ganancia</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProducts.map((product) => (
                                                <tr key={product.id}>
                                                    <td>{product.name}</td>
                                                    <td>{product.quantity}</td>
                                                    <td>{formatCurrencyArs(product.cost)}</td>
                                                    <td>{formatCurrencyArs(product.sellingPrice)}</td>
                                                    <td>{formatCurrencyArs(calculateProfit(product.cost, product.sellingPrice, product.quantity))}</td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleRemoveProduct(product.id)}
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                                <Pagination className="mt-3 justify-content-center">
                                    {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map(number => (
                                        <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                                            {number + 1}
                                        </Pagination.Item>
                                    ))}
                                </Pagination>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-4 g-4">
                    <Col md={6} lg={4}>
                        <Card className="shadow h-100">
                            <Card.Body>
                                <Card.Title>Resumen</Card.Title>
                                <p><strong>Ganancia Total:</strong> {formatCurrencyArs(totalProfit)}</p>
                                <p><strong>Valor Total de los Productos:</strong> {quickStats.totalRevenue}</p>
                                <p><strong>Porcentaje de Ganancia:</strong> {quickStats.profitPercentage}%</p>
                                <Button variant="success" onClick={handleSave} disabled={products.length === 0}>
                                    Guardar Cálculo de Ganancia
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={8}>
                        <Card className="shadow h-100">
                            <Card.Body>
                                <Card.Title>Cómo Funciona la Calculadora</Card.Title>
                                <Alert variant="info">
                                    <Alert.Heading>Calculadora de Ganancias</Alert.Heading>
                                    <p>
                                        Esta herramienta le permite calcular rápidamente las ganancias de sus productos:
                                    </p>
                                    <ol>
                                        <li>Busque y seleccione productos de su inventario.</li>
                                        <li>Ajuste las cantidades según sea necesario.</li>
                                        <li>Vea las estadísticas actualizadas en tiempo real.</li>
                                        <li>Guarde los cálculos para futuras referencias.</li>
                                    </ol>
                                </Alert>
                                <Alert variant="warning">
                                    <Alert.Heading>Consejos de Uso</Alert.Heading>
                                    <p>
                                        Para obtener los mejores resultados:
                                    </p>
                                    <ul>
                                        <li>Mantenga actualizados los precios de costo y venta.</li>
                                        <li>Revise regularmente sus márgenes de ganancia.</li>
                                        <li>Utilice la función de guardado para hacer seguimiento a lo largo del tiempo.</li>
                                    </ul>
                                </Alert>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfitCalculator;