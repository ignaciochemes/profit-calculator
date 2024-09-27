import React, { useState, useEffect } from 'react';
import { Table, Container, Form, Button, Modal, Card, Alert, Pagination } from 'react-bootstrap';
import { formatCurrencyArs, formatCurrencyUsd } from '../../../Utils/CurrencyFormatter';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product/find/all`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
                }
            });
            const data = await response.json();
            if (data?.statusCode === 401) {
                window.location.href = '/signin';
                return;
            }
            setProducts(data.result);
        } catch (error) {
            console.error('Error fetching products:', error);
            setFeedback({ type: 'danger', message: 'Error al cargar los productos. Por favor, intente nuevamente.' });
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleInputChange = (e) => {
        setSelectedProduct({ ...selectedProduct, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = () => {
        let editProduct = {
            name: selectedProduct.name,
            isActive: selectedProduct.isActive,
            cost: Number(selectedProduct.cost),
            costUsd: Number(selectedProduct.costUsd),
            sellingPrice: Number(selectedProduct.sellingPrice),
            sellingPriceUsd: Number(selectedProduct.sellingPriceUsd)
        };

        fetch(`${import.meta.env.VITE_API_URL}/product/update/${selectedProduct.uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('refreshToken')}`
            },
            body: JSON.stringify(editProduct),
        })
            .then(response => response.json())
            .then(data => {
                setProducts(products.map(p => (p.uuid === selectedProduct.uuid ? selectedProduct : p)));
                setShowEditModal(false);
                setFeedback({ type: 'success', message: 'Producto actualizado exitosamente.' });
            })
            .catch(error => {
                console.error('Error updating product:', error);
                setFeedback({ type: 'danger', message: 'Error al actualizar el producto. Por favor, intente nuevamente.' });
            });
    };

    const handleDeleteProduct = () => {
        fetch(`${import.meta.env.VITE_API_URL}/product/delete/${selectedProduct.uuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(() => {
                setProducts(products.filter(p => p.uuid !== selectedProduct.uuid));
                setShowEditModal(false);
                setFeedback({ type: 'success', message: 'Producto eliminado exitosamente.' });
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                setFeedback({ type: 'danger', message: 'Error al eliminar el producto. Por favor, intente nuevamente.' });
            });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <Container className="py-4">
                <h1 className="text-center mb-4">Lista de Productos</h1>
                {feedback && (
                    <Alert variant={feedback.type} onClose={() => setFeedback(null)} dismissible>
                        {feedback.message}
                    </Alert>
                )}
                <Card className="shadow mb-4">
                    <Card.Body>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-3"
                        />
                        <div style={{ overflowX: 'auto' }}>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Costo</th>
                                        <th>Costo USD</th>
                                        <th>Precio de Venta</th>
                                        <th>Precio de Venta USD</th>
                                        <th>Activo</th>
                                        <th>Creado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product) => (
                                        <tr key={product.uuid}>
                                            <td>{product.name}</td>
                                            <td>{formatCurrencyArs(product.cost)}</td>
                                            <td>{formatCurrencyUsd(product.costUsd)}</td>
                                            <td>{formatCurrencyArs(product.sellingPrice)}</td>
                                            <td>{formatCurrencyUsd(product.sellingPriceUsd)}</td>
                                            <td>{product.isActive ? 'Sí' : 'No'}</td>
                                            <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Button variant="warning" size="sm" onClick={() => handleEditClick(product)}>
                                                    Editar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                        <Pagination className="justify-content-center mt-3">
                            {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(number => (
                                <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </Card.Body>
                </Card>
                {selectedProduct && (
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Producto</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formProductName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={selectedProduct.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formProductCost" className="mt-3">
                                    <Form.Label>Costo</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="cost"
                                        value={selectedProduct.cost}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formProductCostUsd" className="mt-3">
                                    <Form.Label>Costo USD</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="costUsd"
                                        value={selectedProduct.costUsd}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formProductSellingPrice" className="mt-3">
                                    <Form.Label>Precio de Venta</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="sellingPrice"
                                        value={selectedProduct.sellingPrice}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formProductSellingPriceUsd" className="mt-3">
                                    <Form.Label>Precio de Venta USD</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="sellingPriceUsd"
                                        value={selectedProduct.sellingPriceUsd}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formProductIsActive" className="mt-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Activo"
                                        name="isActive"
                                        checked={selectedProduct.isActive}
                                        onChange={(e) => setSelectedProduct({ ...selectedProduct, isActive: e.target.checked })}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDeleteProduct}>
                                Eliminar producto
                            </Button>
                            <Button variant="primary" onClick={handleSaveChanges}>
                                Guardar Cambios
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Container>
        </div>
    );
};

export default Products;