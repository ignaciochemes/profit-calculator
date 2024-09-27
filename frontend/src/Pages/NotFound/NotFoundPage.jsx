import { Button, Col, Container, Row } from "react-bootstrap";

function NoFoundPage() {
    return (
        <div>
            <Container className="text-center mt-5">
                <Row>
                    <Col>
                        <h1 className="display-1">404</h1>
                        <h2 className="mb-4">Página no encontrada</h2>
                        <p className="lead mb-4">Lo sentimos, la página que estás buscando no existe.</p>
                        <Button variant="primary" href="/">
                            Volver a la página principal
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default NoFoundPage;