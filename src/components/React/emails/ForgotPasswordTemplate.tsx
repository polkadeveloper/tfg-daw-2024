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

interface EmblemForgotPasswordProps {
  id?: string;
  username?: string;
  updatedDate?: Date;
}

export const EmblemForgotPassword = ({
  id,
  username,
  updatedDate,
}: EmblemForgotPasswordProps) => {
  const formattedDate = new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(updatedDate);

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
              Has olvidado tu contraseña de Emblem? No te preocupes, estamos
              aquí para ayudarte.
            </Text>
            <Text style={paragraph}>
              Este es tu enlace para restablecer tu contraseña: <br />
              <Button
                style={button}
                href={`http://localhost:4321/reset-password/${id}`}
              >
                Reset password
              </Button>
            </Text>
            <Text style={paragraph}>
              Si no has solicitado restablecer tu contraseña, por favor ignora
              este mensaje.
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

EmblemForgotPassword.PreviewProps = {
  username: "alanturing",
  updatedDate: new Date("June 23, 2022 4:06:00 pm UTC"),
} as EmblemForgotPasswordProps;

export default EmblemForgotPassword;

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
