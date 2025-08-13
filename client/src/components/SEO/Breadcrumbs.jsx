import { Link } from 'wouter';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex text-sm text-slate-400 mb-4" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <i className="fas fa-chevron-right text-xs mx-2"></i>
          )}
          {index === items.length - 1 ? (
            <span className="text-slate-300" aria-current="page">{item.name}</span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
