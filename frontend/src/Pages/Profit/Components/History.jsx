import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Card, Pagination, Alert, Spinner, Form, Row, Col } from 'react-bootstrap';
import { formatCurrencyArs } from '../../../Utils/CurrencyFormatter';

const PAGE_SIZE = 5;

function History() {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('');

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const url = new URL(`${import.meta.env.VITE_API_URL}/profit-history/find/all/`);
        url.searchParams.append('limit', PAGE_SIZE);
        url.searchParams.append('offset', (currentPage - 1) * PAGE_SIZE);
        if (dateFilter) url.searchParams.append('date', dateFilter);

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
                }
            });
            const data = await response.json();
            
            if (data?.statusCode === 401) {
                window.location.href = '/signin';
                return;
            }
            
            if (data?.statusCode === 20100 || (Array.isArray(data.result.profitHistory) && data.result.profitHistory.length === 0)) {
                setError('No se encontraron registros para la fecha seleccionada.');
                setHistory([]);
                setTotalPages(1);
            } else if (response.ok) {
                setHistory(data.result.profitHistory);
                setTotalPages(data.result.totalPages);
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error fetching profit history:', error);
            setError('Error al cargar el historial. Por favor, intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, dateFilter]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const calculateProfit = useCallback((cost, sellingPrice, quantity) => {
        return (parseFloat(sellingPrice) - parseFloat(cost)) * parseInt(quantity);
    }, []);

    const calculateTotalProfit = useCallback((profitHistoryProducts) => {
        return profitHistoryProducts.reduce((total, phProduct) => {
            return total + calculateProfit(phProduct.product.cost, phProduct.product.sellingPrice, phProduct.quantity);
        }, 0);
    }, [calculateProfit]);

    const calculateTotalCost = useCallback((profitHistoryProducts) => {
        return profitHistoryProducts.reduce((total, phProduct) => {
            return total + parseFloat(phProduct.product.cost) * parseInt(phProduct.quantity);
        }, 0);
    }, []);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleDateFilterChange = useCallback((e) => {
        setDateFilter(e.target.value);
        setCurrentPage(1);
    }, []);

    const renderPaginationItems = useCallback(() => {
        return [...Array(totalPages)].map((_, index) => (
            <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
            >
                {index + 1}
            </Pagination.Item>
        ));
    }, [totalPages, currentPage, handlePageChange]);

    const renderHistoryRecord = useCallback((record) => (
        <Card className="mb-4" key={record.uuid}>
            <Card.Header className="bg-dark text-white">
                <Row>
                    <Col md={4}><strong>Fecha:</strong> {new Date(record.createdAt).toLocaleString()}</Col>
                    <Col md={4} className="text-center"><strong>Costo Total:</strong> {formatCurrencyArs(calculateTotalCost(record.profitHistoryProducts))}</Col>
                    <Col md={4} className="text-end"><strong>Ganancia Total:</strong> {formatCurrencyArs(calculateTotalProfit(record.profitHistoryProducts))}</Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Costo</th>
                            <th>Precio de Venta</th>
                            <th>Ganancia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {record.profitHistoryProducts.map((phProduct) => (
                            <tr key={phProduct.product.uuid}>
                                <td>{phProduct.product.name}</td>
                                <td>{phProduct.quantity}</td>
                                <td>{formatCurrencyArs(phProduct.product.cost)}</td>
                                <td>{formatCurrencyArs(phProduct.product.sellingPrice)}</td>
                                <td>{formatCurrencyArs(calculateProfit(phProduct.product.cost, phProduct.product.sellingPrice, phProduct.quantity))}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    ), [calculateProfit, calculateTotalCost, calculateTotalProfit]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Container className="py-4">
                <h1 className="text-center mb-4">Historial de Cálculos de Ganancias</h1>

                <Card className="shadow mb-4">
                    <Card.Body>
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Filtrar por fecha</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dateFilter}
                                        onChange={handleDateFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {isLoading ? (
                            <div className="text-center">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </Spinner>
                            </div>
                        ) : error ? (
                            <Alert variant="warning">{error}</Alert>
                        ) : history.length === 0 ? (
                            <Alert variant="info">No se encontraron registros para la fecha seleccionada.</Alert>
                        ) : (
                            <>
                                {history.map(renderHistoryRecord)}

                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                        {renderPaginationItems()}
                                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default History;