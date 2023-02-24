import GlobalNavComponent from './GlobalNavComponent'

export default function SidebarComponent() {
  return (
    <nav className="sticky h-full overflow-y-auto border-r">
      <div className="py-8">
        <GlobalNavComponent />
      </div>
    </nav>
  )
}
