'use client';

import { Button, Link } from "@nextui-org/react"
import Activity from "./Activity"
import Recommended from "./Recommended"
import Container from "./pageLayout/Container"

const Landing = () => {
  return (
    <Container>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Trikl3</h1>
        <p className="mb-8">
          Trikl3 is a platform that connects Kenyan tech students with internship opportunities at leading tech companies. Our AI-driven matching algorithm helps you find internships that are right for you.
        </p>
        <Button as={Link} href="/register" className="btnPri">
          Get started
        </Button>
      </div>
      <Activity />
      <Recommended />
    </Container>
  )
}

export default Landing
