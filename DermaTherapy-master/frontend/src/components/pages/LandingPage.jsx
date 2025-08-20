/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaStethoscope, FaShieldAlt, FaMobileAlt, FaSearch, FaSyringe, FaChartLine } from "react-icons/fa";
import { motion } from "motion/react"
import { Link } from "react-router";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white text-[#03045E] font-sans">
      <header className="bg-[#bbeef7] py-6 shadow-md  top-0 z-50 sticky">
        <div className="container mx-auto flex justify-between items-center px-4 ">
          <h1 className="text-2xl font-bold text-[#0077B6]tracking-tight">DermaTherapy</h1>
          <nav className="space-x-6 text-base ">
            <a href="#features" className="hover:bg-[#00B4D8] px-3 py-2 rounded-2xl scroll-smooth hover:text-white text-bold">Features</a>
            <a href="#about" className="hover:bg-[#00B4D8] px-3 py-2 rounded-2xl scroll-smooth hover:text-white text-bold">About</a>
            <a href="#contact" className="hover:bg-[#00B4D8] px-3 py-2 rounded-2xl scroll-smooth hover:text-white text-bold">Contact</a>
          </nav>
        </div>
      </header>

      <motion.section
        className="container mx-auto px-4 py-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
      >
        <h2 className="text-5xl font-extrabold mb-4 leading-tight ">AI-powered Skin Disease Detection</h2>
        <p className="text-lg mb-6 text-[#0077B6] max-w-2xl mx-auto">
          Upload an image. Detect skin conditions instantly. Get recommended remedies.
        </p>
        <Button className="bg-[#0077B6] hover:bg-[#03045E] text-white px-6 py-6 text-lg rounded-md shadow-lg">
          <Link to="/login">Try it now</Link>
        </Button>
      </motion.section>

      <section id="features" className="bg-[#CAF0F8] py-16">
        <div className="container mx-auto px-4">
          <motion.h3
            className="text-4xl font-bold text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            Features
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
              icon: <FaStethoscope size={40} className="mx-auto mb-4 text-[#03045E]" />,
              title: "Accurate Detection",
              desc: "Trained on thousands of images to identify skin conditions with precision."
            }, {
              icon: <FaShieldAlt size={40} className="mx-auto mb-4 text-[#03045E]" />,
              title: "Safe & Secure",
              desc: "Your data is processed securely and is never stored."
            }, {
              icon: <FaMobileAlt size={40} className="mx-auto mb-4 text-[#03045E]" />,
              title: "Mobile Friendly",
              desc: "Detect skin issues anytime, anywhere – fully responsive experience."
            }, {
              icon: <FaSearch size={40} className="mx-auto mb-4 text-[#03045E]" />,
              title: "Visual Insights",
              desc: "Highlight affected areas visually with annotated results."
            }, {
              icon: <FaSyringe size={40} className="mx-auto mb-4 text-[#03045E]" />,
              title: "Remedy Suggestions",
              desc: "Get personalized remedy recommendations based on condition type."
            }, {
              icon: <FaChartLine size={40} className="mx-auto mb-4 text-[#03045E]" />,
              title: "Progress Tracking",
              desc: "Track skin health improvement over time using image history."
            }].map((feature, idx) => (
              <motion.div
                key={idx}
                className="w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                variants={fadeInUp}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    {feature.icon}
                    <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                    <p className="text-[#0077B6] font-bold">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        id="about"
        className="container mx-auto px-4 py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
      >
        <h3 className="text-4xl font-bold text-center mb-8">About DermaTherapy</h3>
        <hr className="h-0.5 bg-[#CAF0F8]"/>
        <p className="text-center text-lg max-w-3xl mx-auto text-[#0077B6] font-bold mt-7">
          DermaTherapy is a cutting-edge AI-driven platform developed by passionate researchers to
          assist people in early skin disease detection. We aim to bridge the gap between
          accessible diagnosis and effective remedies using technology.
        </p>
      </motion.section>

      <motion.section
        id="contact"
        className="bg-[#CAF0F8] py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-8">Get in Touch</h3>
          <form className="max-w-xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-md bg-violet-50 border-2 focus:border-[#0077B6] focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-md bg-violet-50 border-2 focus:border-[#0077B6] focus:outline-none"
            />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-md bg-violet-50 border-2 focus:border-[#0077B6] focus:outline-none"
            ></textarea>
            <Button className="bg-[#0077B6] hover:bg-[#03045E] text-white w-full py-3 rounded-md">
              Send Message
            </Button>
          </form>
        </div>
      </motion.section>

      <footer className="bg-[#03045E] text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} DermaTherapy. All rights reserved.</p>
      </footer>
    </div>
  );
}

