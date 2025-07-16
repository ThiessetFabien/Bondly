import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-white mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-white/80 mb-6'>
          Page non trouvée
        </h2>
        <p className='text-white/60 mb-8 max-w-md mx-auto'>
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href='/'
          className='inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white/90 hover:bg-white/15 hover:border-white/30 transition-all duration-300'
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
