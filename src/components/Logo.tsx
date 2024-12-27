import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  variant?: 'default' | 'white'
}

const Logo: React.FC<LogoProps> = ({ width = 120, height = 40, variant = 'default' }) => {
  const textColor = variant === 'white' ? '#FFFFFF' : '#1F2937'
  const accentColor = '#4F46E5'
  const secondaryColor = variant === 'white' ? '#FFFFFF' : '#1F2937'
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Novo Ícone Moderno */}
      <g transform="translate(0, 2)">
        {/* Gradientes */}
        <defs>
          <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="glassEffect" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Sombra Base */}
        <path
          d="M6 28L16 22L26 28L16 34L6 28Z"
          fill="#000000"
          opacity="0.1"
          transform="translate(1, 1)"
        />

        {/* Base do Ícone */}
        <path
          d="M4 8L16 2L28 8V24L16 30L4 24V8Z"
          fill="url(#buildingGradient)"
          stroke={secondaryColor}
          strokeWidth="1"
        />

        {/* Efeito de Vidro Superior */}
        <path
          d="M16 2L28 8L16 14L4 8L16 2Z"
          fill="url(#glassEffect)"
          stroke={secondaryColor}
          strokeWidth="1"
        />

        {/* Linhas de Detalhe */}
        <path
          d="M16 14V30"
          stroke={secondaryColor}
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.5"
        />
        <path
          d="M4 8V24"
          stroke={secondaryColor}
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M28 8V24"
          stroke={secondaryColor}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Detalhes Geométricos */}
        <path
          d="M10 11L22 11"
          stroke={secondaryColor}
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M10 17L22 17"
          stroke={secondaryColor}
          strokeWidth="1"
          opacity="0.7"
        />
        <path
          d="M10 23L22 23"
          stroke={secondaryColor}
          strokeWidth="1"
          opacity="0.7"
        />
      </g>

      {/* Texto - Mantido igual */}
      <g>
        <text
          x="35"
          y="25"
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="bold"
          fill="#000000"
          opacity="0.1"
        >
          BuildHub
        </text>
        
        <text
          x="34"
          y="24"
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="bold"
          fill={textColor}
        >
          Build
          <tspan fill={accentColor}>Hub</tspan>
        </text>
        
        <text
          x="34"
          y="34"
          fontFamily="Arial, sans-serif"
          fontSize="8"
          fill={textColor}
          opacity="0.7"
        >
          Gestão de Obras
        </text>
      </g>
    </svg>
  )
}

export default Logo