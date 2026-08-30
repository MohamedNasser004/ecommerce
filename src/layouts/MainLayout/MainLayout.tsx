import {Container} from "react-bootstrap";
import './style.module.css';
import React from "react";
import TopHeader from "../../components/Header/TopHeader.jsx";
import BottomHeader from "../../components/Header/BottomHeader.jsx";
const MainLayout = () => {
    return (
        <>
        <Container className="container">
            <TopHeader />
            <BottomHeader />
        </Container>
        </>
    )
}

export default MainLayout;