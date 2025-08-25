import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='text-center card bg-base-100 shadow-xl p-8'>
        <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-base-content/80 mb-6'>
          Page non trouvée
        </h2>
        <p className='text-base-content/60 mb-8 max-w-md mx-auto'>
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href='/'
          className='btn btn-primary btn-wide normal-case text-lg shadow-md'
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
