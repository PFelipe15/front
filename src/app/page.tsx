'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, ArrowRight, Menu, Building2, ChartBar, Shield, FileText, LineChart, Target, Lightbulb } from 'lucide-react'
import Logo from '@/components/Logo'
import Chatbot from '@/components/Chatbot/Chatbot'

const IMAGES = {
  hero: '/figuras/static_chart.svg',
  charts: '/figuras/chart1.svg',
  data: '/figuras/pie_chart.svg',
  growing: '/figuras/undraw_growing_amt8t.svg',
  visualData: '/figuras/undraw_visual-data_3ghp.svg',
  construction: '/figuras/construcao.svg',
  chart: '/figuras/chart_segmentacao.svg',
  dashboard: '/figuras/dashboard.svg'
}

 
 
export default function LandingPage() {
   const [currentImage, setCurrentImage] = useState(0)
  const images = [
    { src: IMAGES.hero, alt: "Construção Inteligente" },
    { src: IMAGES.data, alt: "Dashboard Preview" }
  ]
  const [isScrolled, setIsScrolled] = useState(false)

  // Detecta scroll para mudar o estilo do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Efeito para alternar as imagens
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0))
    }, 5000) // Troca a cada 5 segundos

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Elementos decorativos globais */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Blob superior direito */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        {/* Blob inferior esquerdo */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header com elemento decorativo */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo com efeito hover */}
            <Link 
              href="/" 
              className="relative group"
            >
              <div className="flex items-center gap-2">
                <Logo height={65} width={175} />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-primary to-blue-400 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </Link>

            {/* Menu Principal com Design Moderno */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center bg-gray-50/80 backdrop-blur-md rounded-full px-6 py-2 mr-6 shadow-sm">
                {['Recursos', 'Benefícios', 'Depoimentos'].map((item, index) => (
                  <Link
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="relative px-5 py-2 text-[15px] font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                  </Link>
                ))}
              </div>

              {/* Botões de Ação Redesenhados */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost"
                  
                  className="relative overflow-hidden group px-6 py-2 text-[15px] font-medium"
                >
                  <a href="/login" className="relative z-10 text-gray-700 group-hover:text-white transition-colors duration-300">
                    Entrar
                  </a>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Button>
                <Button 
                  className="relative overflow-hidden group bg-gradient-to-r from-blue-600 via-blue-500 to-primary text-white rounded-full px-6 py-2 text-[15px] font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Começar Grátis
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>
            </nav>

            {/* Menu Mobile Redesenhado */}
            <button className="lg:hidden relative group p-3">
              <Menu className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
              <div className="absolute inset-0 bg-gray-100 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></div>
            </button>
          </div>
        </div>

        {/* Elementos Decorativos Modernos */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Linha superior com gradiente animado */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-shimmer"></div>
          
          {/* Elementos flutuantes */}
          <div className="absolute -top-10 right-1/4 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute -top-5 left-1/3 w-16 h-16 bg-primary/10 rounded-full blur-2xl animate-float-delayed"></div>
          
          {/* Partículas decorativas */}
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-primary/40 rounded-full animate-ping"></div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute top-60 -left-20 w-60 h-60 bg-orange-100 rounded-full opacity-50 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="md:w-1/2 space-y-8"
              >
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-[#0F172A] via-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Transforme a Gestão da sua <span className="text-[#0F172A]">Construtora</span>
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Plataforma completa para gerenciar projetos, equipes e recursos. 
                  Aumente a eficiência e reduza custos com nossa solução inteligente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Começar Agora <ArrowRight className="ml-2" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-full"
                  >
                    Ver Demonstração
                  </Button>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Teste Grátis 14 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Suporte 24/7</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:w-1/2 relative"
              >
                <div className="relative h-[500px] w-full">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: currentImage === index ? 1 : 0,
                        y: currentImage === index ? 0 : 20,
                      }}
                      transition={{ 
                        opacity: { duration: 0.5 },
                        y: { 
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 2
                        }
                      }}
                      className={`absolute inset-0 ${currentImage === index ? 'z-10' : 'z-0'}`}
                    >
                      <div className="  rounded-2xl   p-4">
                        <div className="relative">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={600}
                            height={400}
                            className="w-full  object-contain max-h-[600px] rounded-xl "
                          />
                          <div className="absolute inset-0  rounded-xl"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Indicadores de slide */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentImage === index 
                            ? 'bg-primary w-4' 
                            : 'bg-blue-300'
                        }`}
                      />
                    ))}
                  </div>

                 
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-blue-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Projetos Gerenciados" },
                { number: "98%", label: "Clientes Satisfeitos" },
                { number: "30%", label: "Redução de Custos" },
                { number: "5000+", label: "Usuários Ativos" }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-blue-800/50 backdrop-blur-sm rounded-xl p-6 text-center"
                >
                  <div className="text-4xl font-bold text-white mb-2">{metric.number}</div>
                  <div className="text-blue-200">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Recursos Poderosos para sua Construtora
              </h2>
              <p className="text-xl text-blue-600 max-w-2xl mx-auto">
                Tudo que você precisa para gerenciar sua construtora em um só lugar
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Building2 className="w-12 h-12 text-orange-500" />,
                  title: "Gestão de Projetos",
                  description: "Acompanhe todos os aspectos dos seus projetos em tempo real",
                  image: IMAGES.chart
                },
                {
                  icon: <ChartBar className="w-12 h-12 text-orange-500" />,
                  title: "Análise Financeira",
                  description: "Controle orçamentos e custos com precisão",
                  image: IMAGES.charts
                },
                {
                  icon: <Users className="w-12 h-12 text-orange-500" />,
                  title: "Gestão de Equipes",
                  description: "Gerencie equipes e recursos de forma eficiente",
                  image: IMAGES.data
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">{feature.title}</h3>
                  <p className="text-blue-600 mb-6">{feature.description}</p>
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={200}
                    height={150}
                    className="w-full rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <Image
                  src="/figuras/data_statics.svg"
                  alt="Análise de Dados"
                  width={500}
                  height={400}
                  className="w-full max-w-[600px]"
                />
              </div>
              <div className="md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                  Inovação e Inteligência em Dados
                </h2>
                <p className="text-lg text-blue-700">
                  Transforme dados em decisões estratégicas com nossa plataforma de análise avançada
                </p>
       
      <Chatbot />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <ChartBar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Analytics Avançado</h3>
                      <p className="text-gray-600">Visualize tendências e padrões com dashboards interativos e relatórios personalizados</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                      <LineChart className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Previsões Inteligentes</h3>
                      <p className="text-gray-600">Antecipe tendências e tome decisões baseadas em dados com nosso sistema preditivo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">KPIs em Tempo Real</h3>
                      <p className="text-gray-600">Monitore indicadores-chave e métricas importantes em tempo real</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Insights Automáticos</h3>
                      <p className="text-gray-600">Receba recomendações inteligentes baseadas na análise dos seus dados</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  >
                    Conhecer Analytics <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute -right-32 top-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-[10%] w-4 h-12 bg-primary/20 rounded-full rotate-12"></div>
          <div className="absolute bottom-20 right-[15%] w-8 h-8 bg-primary/15 rounded-lg rotate-45"></div>
        </section>

        <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">
              Comece a Transformar sua Construtora Hoje
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Junte-se a milhares de construtoras que já estão economizando tempo e dinheiro com o BuildHub
            </p>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
              Começar Gratuitamente
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">ConstructPro</h4>
              <p className="text-blue-200">
                Construindo o futuro da gestão de projetos na construção civil.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Gestão de Projetos</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Controle Financeiro</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Gestão de Equipes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 ConstructPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

