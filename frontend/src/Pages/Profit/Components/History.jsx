import React, { useState, useEffect } from 'react';
import { Table, Container, Card, Pagination, Alert, Spinner, Form, Row, Col } from 'react-bootstrap';

function History() {
    const [history, setHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('');
    const pageSize = 5;

    useEffect(() => {
        fetchHistory();
    }, [currentPage, dateFilter]);

    const fetchHistory = async () => {
        setIsLoading(true);
        let url = `http://localhost:33000/api/v1/carta-online/profit-history/find/all/?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`;
        if (dateFilter) {
            url += `&date=${dateFilter}`;
        }

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
            setHistory(data.result.profitHistory);
            setTotalPages(data.result.totalPages);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching profit history:', error);
            setError('Error al cargar el historial. Por favor, intente nuevamente.');
            setIsLoading(false);
        }
    };

    const calculateProfit = (cost, sellingPrice, quantity) => {
        return (parseFloat(sellingPrice) - parseFloat(cost)) * parseInt(quantity);
    };

    const calculateTotalProfit = (profitHistoryProducts) => {
        return profitHistoryProducts.reduce((total, phProduct) => {
            return total + calculateProfit(phProduct.product.cost, phProduct.product.sellingPrice, phProduct.quantity);
        }, 0).toFixed(2);
    };

    const calculateTotalCost = (profitHistoryProducts) => {
        return profitHistoryProducts.reduce((total, phProduct) => {
            return total + parseFloat(phProduct.product.cost) * parseInt(phProduct.quantity);
        }, 0).toFixed(2);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDateFilterChange = (e) => {
        setDateFilter(e.target.value);
        setCurrentPage(1);
    };

    if (isLoading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Historial de Cálculos de Ganancias</h1>

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

            {history.length === 0 ? (
                <Alert variant="info">No se encontraron registros para la fecha seleccionada.</Alert>
            ) : (
                history.map((record) => (
                    <Card className="mb-4" key={record.uuid}>
                        <Card.Header className="bg-dark text-white">
                            <Row>
                                <Col md={4}><strong>Fecha:</strong> {new Date(record.createdAt).toLocaleString()}</Col>
                                <Col md={4} className="text-center"><strong>Costo Total:</strong> ${Number(calculateTotalCost(record.profitHistoryProducts)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Col>
                                <Col md={4} className="text-end"><strong>Ganancia Total:</strong> ${Number(calculateTotalProfit(record.profitHistoryProducts)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</Col>
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
                                            <td>${Number(phProduct.product.cost).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                            <td>${Number(phProduct.product.sellingPrice).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                            <td>${Number(calculateProfit(phProduct.product.cost, phProduct.product.sellingPrice, phProduct.quantity)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                ))
            )}

            {/* Controles de paginación */}
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </Container>
    );
}

export default History;