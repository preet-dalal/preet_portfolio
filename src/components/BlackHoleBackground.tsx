export default function BlackHoleBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: 'url(https://mymodernmet.com/wp/wp-content/uploads/2019/10/nasa-black-hole-visualization-1.gif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.2
      }}
    />
  )
}
