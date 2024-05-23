import {
  Body,
  Container,
  Column,
  Button,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { color } from "framer-motion";
import * as React from "react";

interface WelcomeTemplateProps {
  username?: string;
}

export const WelcomeTemplate = ({ username }: WelcomeTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Se ha actualizado de manera correcta tu contraseña de Emblem.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Row>
              <Column
                align="center"
                style={{ width: "50%", paddingLeft: "8px" }}
              >
                <Img
                  width={100}
                  src={`https://res.cloudinary.com/dle7lr00f/image/upload/v1716203266/m2ncrby50tayrxqblebv.png`}
                />
              </Column>
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hola {username},</Text>
            <Text style={paragraph}>
              Bienvenido a Emblem, la tienda de ropa online más exclusiva.{" "}
              <br />
              <Button style={button} href={`http://localhost:4321/`}>
                Get started
              </Button>
            </Text>
            <Text style={paragraph}>
              Nos alegra tenerte con nosotros. Si tienes alguna pregunta o
              necesitas ayuda, no dudes en ponerte en contacto con nosotros en{" "}
              <Link href={`mailto:support@emblem.com`} style={link}>
                Emblem Support
              </Link>
            </Text>
            <Text style={paragraph}>
              Gracias, <br />
              El equipo de Emblem
            </Text>
          </Section>
          <Section style={footer}>
            <Row>
              <Column
                align="center"
                style={{ width: "50%", paddingLeft: "8px" }}
              >
                <Img
                  width={80}
                  src={`https://res.cloudinary.com/dle7lr00f/image/upload/v1716203266/m2ncrby50tayrxqblebv.png`}
                />
              </Column>
            </Row>
            <Row>
              <Text style={{ textAlign: "center", color: "#ffffff" }}>
                © 2024 Emblem, Todos los derechos reservados <br />
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

WelcomeTemplate.PreviewProps = {
  username: "alanturing",
  updatedDate: new Date("June 23, 2022 4:06:00 pm UTC"),
} as WelcomeTemplateProps;

export default WelcomeTemplate;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#ffffff",
  color: "#ffffff",
  fontFamily,
  marginTop: 30,
  marginBottom: 30,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
  color: "#ffffff",
};

const container = {
  maxWidth: "650px",
  minHeight: "55vh",
  backgroundColor: "#32347d",
  color: "#ffffff",
};

const footer = {
  maxWidth: "650px",
  padding: 15,
  backgroundColor: "#343498",
};

const content = {
  padding: "5px 20px 10px 20px",
};

const logo = {
  padding: 30,
  backgroundColor: "#343498",
};

const sectionsBorders = {
  width: "100%",
  height: "10px",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid #ffffff",
  width: "102px",
};

const link = {
  textDecoration: "underline",
  color: "#c387f9",
};

const button = {
  display: "block",
  margin: "0 auto",
  marginTop: "20px",
  marginBottom: "20px",
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  width: "150px",
  padding: "14px 7px",
};
