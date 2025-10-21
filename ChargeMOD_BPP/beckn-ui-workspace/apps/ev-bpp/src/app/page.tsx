'use client'

import React, { useMemo, useState } from 'react'
import {
  Battery,
  BatteryCharging,
  Bolt,
  Building2,
  Check,
  ClipboardCopy,
  DollarSign,
  Factory,
  FileJson,
  Globe,
  Info,
  MapPin,
  Plus,
  Search,
  ServerCog,
  ShieldCheck,
  Store,
  Timer,
  Trash2,
  User,
  X
} from 'lucide-react'

/**
 * Seller Platform (chargeMOD)
 * Next.js App Router page component (TypeScript + TailwindCSS)
 * Drop this file into: app/seller/page.tsx
 *
 * Notes:
 * - Uses Tailwind design tokens like bg-background, text-foreground, etc. Map them in globals.css or replace with palette classes.
 * - No shadcn dependency; tiny UI primitives included below.
 * - Mock local state only; wire your APIs where marked.
 */

// ------------------------------
// Minimal UI primitives
// ------------------------------
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`rounded-2xl border bg-background text-foreground shadow-sm ${className}`} {...props} />
)
const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props} />
)
const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', ...props }) => (
  <h2 className={`text-lg font-semibold ${className}`} {...props} />
)
const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props} />
)
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => (
  <div className={`p-5 pt-0 ${className}`} {...props} />
)

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className = '', ...props }) => (
  <label className={`text-sm font-medium ${className}`} {...props} />
)

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary ${className}`}
      {...props}
    />
  )
)
Input.displayName = 'Input'

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea className={`w-full rounded-xl border bg-background p-3 text-sm outline-none transition focus:ring-2 focus:ring-primary ${className}`} {...props} />
)

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted transition disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => (
  <select
    className={`h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary ${className}`}
    {...props}
  >
    {children}
  </select>
)

const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void } & React.HTMLAttributes<HTMLButtonElement>> = ({ checked, onChange, className = '', ...props }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-primary' : 'bg-muted'} ${className}`}
    {...props}
  >
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${checked ? 'left-6' : 'left-0.5'}`} />
  </button>
)

const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`animate-spin h-4 w-4 ${className}`} viewBox="0 0 24 24" aria-hidden>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
  </svg>
)

function Toast({ open, title, description, onClose, action }: { open: boolean; title: string; description?: string; onClose: () => void; action?: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[360px] rounded-2xl border bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary"><Check className="h-4 w-4" /></div>
          <div className="flex-1">
            <div className="font-semibold">{title}</div>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-3">{action}</div>}
          </div>
          <button className="rounded-lg p-1 text-muted-foreground hover:bg-muted" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ------------------------------
// Domain types & helpers
// ------------------------------
export type SellerComponent = 'VPP' | 'Micro-grid' | 'AC Charger' | 'DC Charger' | 'Battery Storage'

export type SupplierOrg = {
  organisation_name: string
  short_name: string
  type_of_organisation: string
  registration_number: string
  PAN: string
  location_details: {
    head_office_address: string
    branch_or_regional_office: string
    country: string
    state_or_province: string
    city_or_district: string
    pin_code: string
  }
  contact_information: {
    official_email: string
    official_phone_number: string
    website_url: string
  }
}

export type ElectricalParams = {
  voltage: { unit: 'Volts'; value: number }
  current: { unit: 'Amperes'; value: number }
  power_factor: { value: number; description: string }
  active_power: { unit: 'kW'; value: number; description: string }
  reactive_power: { unit: 'kVAR'; value: number; description: string }
  apparent_power: { unit: 'kVA'; value: number; description: string }
  frequency: { unit: 'Hz'; value: number }
  energy_transferred: { unit: 'kWh'; value: number; description: string }
  meter_reading: { unit: 'kWh'; value: number; description: string }
  transaction_timestamp: string
}

export type ServiceSchema = {
  descriptor: { name: string; short_desc: string; long_desc: string }
  category_id: 'EV_ENERGY'
  price: { currency: 'INR'; value: number }
  fulfillment: { type: 'ON_FULFILLMENT' | 'ON_DELIVERY' }
  electrical_parameters: ElectricalParams
}

export type TransactionDetails = {
  buyer: { participant_id: string; organisation_name: string }
  seller: { participant_id: string; organisation_name: string }
  transaction_id: string
  order_status: 'INIT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  payment: { amount: number; currency: 'INR'; payment_status: 'PENDING' | 'PAID' | 'FAILED'; payment_method: 'UPI' | 'CARD' | 'NEFT' }
}

export type Offering = {
  id: string
  component: SellerComponent
  title: string
  location: string
  available: boolean
  minKwh: number
  maxKwh: number
  pricePerKwh: number
  rating?: number
  tags?: string[]
}

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
const GST_RATE = 0.18

function computeTotals(energyKwh: number, pricePerKwh: number, feeRate = 0.03, gstRate = GST_RATE) {
  const base = energyKwh * pricePerKwh
  const platformFee = Math.max(10, Math.round(feeRate * base))
  const subtotal = base + platformFee
  const gst = subtotal * gstRate
  const total = subtotal + gst
  return { base, platformFee, subtotal, gst, total }
}

function buildOrderPayload(org: SupplierOrg, service: ServiceSchema, tx: TransactionDetails) {
  return {
    organisation_details: org,
    service_schema: service,
    transaction_details: tx
  }
}

function nowISO() {
  return new Date().toISOString()
}

// ------------------------------
// Demo data
// ------------------------------
const DEMO_ORG: SupplierOrg = {
  organisation_name: '',
  short_name: '',
  type_of_organisation: '',
  registration_number: '',
  PAN: '',
  location_details: {
    head_office_address: '',
    branch_or_regional_office: '',
    country: 'India',
    state_or_province: 'Karnataka',
    city_or_district: 'Bengaluru',
    pin_code: ''
  },
  contact_information: { official_email: '', official_phone_number: '', website_url: '' }
}

const DEMO_PARAMS: ElectricalParams = {
  voltage: { unit: 'Volts', value: 415 },
  current: { unit: 'Amperes', value: 32 },
  power_factor: { value: 0.95, description: 'Ratio of real power to apparent power' },
  active_power: { unit: 'kW', value: 20, description: 'The actual power consumed or generated' },
  reactive_power: { unit: 'kVAR', value: 5, description: 'Reactive power component' },
  apparent_power: { unit: 'kVA', value: 21, description: 'Combined effect of active and reactive power' },
  frequency: { unit: 'Hz', value: 50 },
  energy_transferred: { unit: 'kWh', value: 0, description: 'The amount of electrical energy delivered/sold' },
  meter_reading: { unit: 'kWh', value: 0, description: 'Meter measurement used for billing' },
  transaction_timestamp: nowISO()
}

const DEFAULT_SERVICE: ServiceSchema = {
  descriptor: {
    name: 'EV Energy Charging or Selling Service',
    short_desc: 'Provision to buy or sell electrical energy for EV stations',
    long_desc: 'Platform for trading electrical energy between EV charging stations, buyers, and sellers using Beckn Protocol.'
  },
  category_id: 'EV_ENERGY',
  price: { currency: 'INR', value: 0 },
  fulfillment: { type: 'ON_FULFILLMENT' },
  electrical_parameters: DEMO_PARAMS
}

const DEMO_TX: TransactionDetails = {
  buyer: { participant_id: '', organisation_name: '' },
  seller: { participant_id: '', organisation_name: '' },
  transaction_id: 'txn-123456',
  order_status: 'INIT',
  payment: { amount: 0, currency: 'INR', payment_status: 'PENDING', payment_method: 'UPI' }
}

const INITIAL_OFFERINGS: Offering[] = [
  {
    id: 'off-001',
    component: 'VPP',
    title: 'chargeMOD Virtual Power Plant Block',
    location: 'Bengaluru',
    available: true,
    minKwh: 10,
    maxKwh: 500,
    pricePerKwh: 12.5,
    rating: 4.7,
    tags: ['Low-carbon', 'Best for bulk']
  },
  {
    id: 'off-002',
    component: 'Micro-grid',
    title: 'SunSpark Micro-grid (Solar mix)',
    location: 'Mysuru',
    available: true,
    minKwh: 5,
    maxKwh: 150,
    pricePerKwh: 11.9,
    rating: 4.4,
    tags: ['Green']
  },
  {
    id: 'off-003',
    component: 'DC Charger',
    title: '120 kW DC Fast Charger Slot',
    location: 'Kochi',
    available: false,
    minKwh: 20,
    maxKwh: 200,
    pricePerKwh: 14.2,
    rating: 4.3,
    tags: ['High power']
  },
  {
    id: 'off-004',
    component: 'AC Charger',
    title: 'Type-2 AC Charger Window',
    location: 'Coimbatore',
    available: true,
    minKwh: 2,
    maxKwh: 40,
    pricePerKwh: 10.8,
    rating: 4.1
  },
  {
    id: 'off-005',
    component: 'Battery Storage',
    title: '1 MWh BESS Discharge Block',
    location: 'Bengaluru',
    available: true,
    minKwh: 50,
    maxKwh: 1000,
    pricePerKwh: 13.0,
    rating: 4.5,
    tags: ['Peak shaving']
  }
]

// ------------------------------
// Seller Page
// ------------------------------
export default function SellerPlatformPage() {
  // Left nav pin
  const [sidebarOpen] = useState(true)

  // Supplier profile
  const [org, setOrg] = useState<SupplierOrg>(DEMO_ORG)

  // Service schema (shared defaults — per-offering price will override at publish time)
  const [service, setService] = useState<ServiceSchema>(DEFAULT_SERVICE)

  // Transactions (only for payload preview / demo)
  const [tx, setTx] = useState<TransactionDetails>(DEMO_TX)

  // Offerings & search
  const [offerings, setOfferings] = useState<Offering[]>(INITIAL_OFFERINGS)
  const [q, setQ] = useState('')
  const [compFilter, setCompFilter] = useState<SellerComponent | 'All'>('All')
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false)

  // Compose publish selection
  const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(offerings[0]?.id ?? null)
  const selected = useMemo(() => offerings.find(o => o.id === selectedOfferingId) || null, [offerings, selectedOfferingId])

  // Sell-side input (energy block & quick quote)
  const [energyKwh, setEnergyKwh] = useState<number>(selected?.minKwh ?? 10)
  const pricePerKwh = selected?.pricePerKwh ?? 0
  const totals = computeTotals(energyKwh, pricePerKwh)

  // UX
  const [isPublishing, setIsPublishing] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return offerings.filter(o => {
      const matchesQ = !s || o.title.toLowerCase().includes(s) || o.location.toLowerCase().includes(s) || o.component.toLowerCase().includes(s)
      const matchesComp = compFilter === 'All' || o.component === compFilter
      const matchesAvail = !onlyAvailable || o.available
      return matchesQ && matchesComp && matchesAvail
    })
  }, [offerings, q, compFilter, onlyAvailable])

  function resetServiceTimestamp() {
    setService(prev => ({ ...prev, electrical_parameters: { ...prev.electrical_parameters, transaction_timestamp: nowISO() } }))
  }

  function addOffering() {
    const id = `off-${Math.random().toString(36).slice(2, 8)}`
    const fresh: Offering = {
      id,
      component: 'VPP',
      title: 'New Energy Block',
      location: org.location_details.city_or_district || 'Bengaluru',
      available: true,
      minKwh: 5,
      maxKwh: 100,
      pricePerKwh: 12
    }
    setOfferings(prev => [fresh, ...prev])
    setSelectedOfferingId(id)
    setEnergyKwh(fresh.minKwh)
  }

  function removeOffering(id: string) {
    setOfferings(prev => prev.filter(o => o.id !== id))
    if (selectedOfferingId === id) setSelectedOfferingId(null)
  }

  function updateOffering(id: string, patch: Partial<Offering>) {
    setOfferings(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)))
  }

  function handleCopy(json: any) {
    navigator.clipboard?.writeText(JSON.stringify(json, null, 2)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  async function publishOffering() {
    if (!selected) return

    // Clamp energy
    const clamped = Math.max(selected.minKwh, Math.min(selected.maxKwh, energyKwh))
    if (clamped !== energyKwh) setEnergyKwh(clamped)

    setIsPublishing(true)

    // Build price into service for this publish action
    const perPublishService: ServiceSchema = {
      ...service,
      price: { currency: 'INR', value: selected.pricePerKwh }
    }

    const payload = buildOrderPayload(org, perPublishService, {
      ...tx,
      seller: { participant_id: org.short_name || 'seller.chargemod', organisation_name: org.organisation_name || 'Supplier Org' },
      payment: { ...tx.payment, amount: totals.total }
    })

    // TODO: Replace with your network/API call
    await new Promise(r => setTimeout(r, 900))

    setIsPublishing(false)
    setToastOpen(true)

    // Side-effect: refresh timestamp for next publish
    resetServiceTimestamp()
  }

  // Keep energy slider/input in bounds as selected offering changes
  React.useEffect(() => {
    if (!selected) return
    setEnergyKwh(v => Math.min(Math.max(v, selected.minKwh), selected.maxKwh))
  }, [selected])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10"><Bolt className="h-5 w-5" /></div>
            <div className="leading-tight">
              <div className="font-semibold">chargeMOD</div>
              <div className="text-xs text-muted-foreground">Seller Energy Platform</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
            <ShieldCheck className="h-4 w-4" />BIS compliant • GST invoice ready
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[280px_1fr] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="md:sticky md:top-20 h-fit space-y-4">
            {/* Supplier profile quick card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-muted"><Store className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold leading-tight">Supplier Profile</div>
                    <div className="text-xs text-muted-foreground">{org.short_name || 'short-name'}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">City</span><span>{org.location_details.city_or_district || 'Bengaluru'}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Email</span><span>{org.contact_information.official_email || '—'}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Phone</span><span>{org.contact_information.official_phone_number || '—'}</span></div>
              </CardContent>
            </Card>

            {/* Search & filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Search offerings</CardTitle>
                <CardDescription>Filter by component & city.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search title, city, component…"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                  />
                </div>
                <Select value={compFilter} onChange={e => setCompFilter(e.target.value as any)}>
                  <option value="All">All components</option>
                  <option value="VPP">Virtual Power Plant</option>
                  <option value="Micro-grid">Micro power plant</option>
                  <option value="AC Charger">EV Charger (AC)</option>
                  <option value="DC Charger">EV Charger (DC)</option>
                  <option value="Battery Storage">Battery storage</option>
                </Select>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Only available</span>
                  <Switch checked={onlyAvailable} onChange={setOnlyAvailable} />
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" onClick={() => addOffering()}>
                    <Plus className="h-4 w-4" /> Add offering
                  </Button>
                  <GhostButton type="button" onClick={() => { setQ(''); setCompFilter('All'); setOnlyAvailable(false) }}>
                    <X className="h-4 w-4" /> Clear
                  </GhostButton>
                </div>
              </CardContent>
            </Card>
          </aside>
        )}

        {/* Main */}
        <main className="space-y-6">
          {/* Offerings grid */}
          <Card className="border-dashed">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Your energy offerings</CardTitle>
              <CardDescription>Click a card to edit & publish.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(o => (
                <button key={o.id} onClick={() => setSelectedOfferingId(o.id)}
                  className={`group relative rounded-2xl border p-4 text-left shadow-sm transition hover:shadow-md ${selectedOfferingId === o.id ? 'border-transparent ring-2 ring-primary' : 'border-muted'} ${!o.available ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium leading-tight">{o.title}</div>
                    <div className="text-sm text-muted-foreground">{INR.format(o.pricePerKwh)}/kWh</div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{o.component}</span>
                    <span>{o.location} • {o.minKwh}-{o.maxKwh} kWh</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {o.tags?.map(t => (
                      <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  {!o.available && (
                    <div className="absolute right-2 top-2 rounded-full bg-muted px-2 py-0.5 text-[11px]">Unavailable</div>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                  No offerings match your filters.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editor & Publish */}
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            {/* Editor */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Edit offering</CardTitle>
                <CardDescription>Set capacity, pricing and availability.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selected ? (
                  <div className="text-sm text-muted-foreground">Select an offering from the list.</div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={selected.title} onChange={e => updateOffering(selected.id, { title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Component</Label>
                      <Select value={selected.component} onChange={e => updateOffering(selected.id, { component: e.target.value as SellerComponent })}>
                        <option value="VPP">Virtual Power Plant</option>
                        <option value="Micro-grid">Micro power plant</option>
                        <option value="AC Charger">EV Charger (AC)</option>
                        <option value="DC Charger">EV Charger (DC)</option>
                        <option value="Battery Storage">Battery storage</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" value={selected.location} onChange={e => updateOffering(selected.id, { location: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Available</Label>
                      <div className="flex items-center justify-between rounded-xl border p-2">
                        <span className="text-sm text-muted-foreground">Toggle availability</span>
                        <Switch checked={selected.available} onChange={v => updateOffering(selected.id, { available: v })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Min kWh</Label>
                      <Input type="number" value={selected.minKwh} onChange={e => updateOffering(selected.id, { minKwh: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Max kWh</Label>
                      <Input type="number" value={selected.maxKwh} onChange={e => updateOffering(selected.id, { maxKwh: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (INR/kWh)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" type="number" value={selected.pricePerKwh}
                          onChange={e => updateOffering(selected.id, { pricePerKwh: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between">
                      <GhostButton type="button" className="text-red-600" onClick={() => removeOffering(selected.id)}>
                        <Trash2 className="h-4 w-4" /> Remove offering
                      </GhostButton>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publish & Quote */}
            <Card className="lg:sticky lg:top-20 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Quick quote & publish</CardTitle>
                <CardDescription>Share this block on the network.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selected ? (
                  <div className="text-sm text-muted-foreground">Select an offering to proceed.</div>
                ) : (
                  <>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center justify-between"><span className="text-muted-foreground">Offering</span><span className="font-medium">{selected.title}</span></div>
                      <div className="flex items-center justify-between"><span className="text-muted-foreground">Component</span><span className="font-medium">{selected.component}</span></div>
                      <div className="flex items-center justify-between"><span className="text-muted-foreground">City</span><span className="font-medium">{selected.location}</span></div>
                    </div>
                    <div className="h-px bg-border" />

                    <div className="space-y-2">
                      <Label>Energy block (kWh)</Label>
                      <Input type="number" value={energyKwh} onChange={e => setEnergyKwh(Number(e.target.value))} />
                      <p className="text-xs text-muted-foreground">Range: {selected.minKwh} – {selected.maxKwh} kWh</p>
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between"><span>Base</span><span>{INR.format(totals.base)}</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-1.5">Platform fee<Info className="h-3.5 w-3.5 text-muted-foreground" /></span><span>{INR.format(totals.platformFee)}</span></div>
                      <div className="flex items-center justify-between"><span>Subtotal</span><span>{INR.format(totals.subtotal)}</span></div>
                      <div className="flex items-center justify-between"><span>GST (18%)</span><span>{INR.format(totals.gst)}</span></div>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex items-center justify-between text-base font-semibold"><span>Buyer pays</span><span>{INR.format(totals.total)}</span></div>

                    <Button className="w-full h-11 rounded-2xl" disabled={!selected.available || isPublishing} onClick={publishOffering}>
                      {isPublishing ? (<><Spinner /> Publishing…</>) : (<>Publish offering</>)}
                    </Button>
                    {!selected.available && (<p className="text-center text-xs text-muted-foreground">Mark offering as available to publish.</p>)}

                    {/* Payload preview */}
                    <details className="rounded-xl border p-3" open>
                      <summary className="cursor-pointer text-sm font-medium flex items-center gap-2"><FileJson className="h-4 w-4" />Payload preview</summary>
                      <div className="mt-3">
                        {(() => {
                          const perPublishService: ServiceSchema = { ...service, price: { currency: 'INR', value: selected.pricePerKwh } }
                          const payload = buildOrderPayload(org, perPublishService, { ...tx, payment: { ...tx.payment, amount: totals.total } })
                          return (
                            <div className="rounded-xl border bg-muted/30 p-3">
                              <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-medium">Order Schema</div>
                                <Button type="button" onClick={() => handleCopy(payload)}>
                                  {copied ? (<><Check className="h-4 w-4" />Copied</>) : (<><ClipboardCopy className="h-4 w-4" />Copy</>)}
                                </Button>
                              </div>
                              <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(payload, null, 2)}</pre>
                            </div>
                          )
                        })()}
                      </div>
                    </details>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Supplier details (full form maps your JSON exactly) */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Supplier details</CardTitle>
              <CardDescription>This maps 1:1 to your required schema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Organisation */}
              <details className="rounded-xl border p-3" open>
                <summary className="cursor-pointer text-sm font-medium flex items-center gap-2"><Building2 className="h-4 w-4" />Organisation details</summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div><Label>Organisation name</Label><Input value={org.organisation_name} onChange={e => setOrg({ ...org, organisation_name: e.target.value })} /></div>
                  <div><Label>Short name</Label><Input value={org.short_name} onChange={e => setOrg({ ...org, short_name: e.target.value })} /></div>
                  <div><Label>Type of organisation</Label><Input value={org.type_of_organisation} onChange={e => setOrg({ ...org, type_of_organisation: e.target.value })} /></div>
                  <div><Label>Registration number</Label><Input value={org.registration_number} onChange={e => setOrg({ ...org, registration_number: e.target.value })} /></div>
                  <div><Label>PAN</Label><Input value={org.PAN} onChange={e => setOrg({ ...org, PAN: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label>Head office address</Label><Textarea rows={2} value={org.location_details.head_office_address} onChange={e => setOrg({ ...org, location_details: { ...org.location_details, head_office_address: e.target.value } })} /></div>
                  <div><Label>Branch/Regional office</Label><Input value={org.location_details.branch_or_regional_office} onChange={e => setOrg({ ...org, location_details: { ...org.location_details, branch_or_regional_office: e.target.value } })} /></div>
                  <div><Label>Country</Label><Input value={org.location_details.country} onChange={e => setOrg({ ...org, location_details: { ...org.location_details, country: e.target.value } })} /></div>
                  <div><Label>State/Province</Label><Input value={org.location_details.state_or_province} onChange={e => setOrg({ ...org, location_details: { ...org.location_details, state_or_province: e.target.value } })} /></div>
                  <div><Label>City/District</Label><Input value={org.location_details.city_or_district} onChange={e => setOrg({ ...org, location_details: { ...org.location_details, city_or_district: e.target.value } })} /></div>
                  <div><Label>PIN code</Label><Input value={org.location_details.pin_code} onChange={e => setOrg({ ...org, location_details: { ...org.location_details, pin_code: e.target.value } })} /></div>
                  <div><Label>Official email</Label><Input value={org.contact_information.official_email} onChange={e => setOrg({ ...org, contact_information: { ...org.contact_information, official_email: e.target.value } })} /></div>
                  <div><Label>Official phone</Label><Input value={org.contact_information.official_phone_number} onChange={e => setOrg({ ...org, contact_information: { ...org.contact_information, official_phone_number: e.target.value } })} /></div>
                  <div className="sm:col-span-2"><Label>Website URL</Label><Input value={org.contact_information.website_url} onChange={e => setOrg({ ...org, contact_information: { ...org.contact_information, website_url: e.target.value } })} /></div>
                </div>
              </details>

              {/* Service schema */}
              <details className="rounded-xl border p-3" open>
                <summary className="cursor-pointer text-sm font-medium flex items-center gap-2"><ServerCog className="h-4 w-4" />Service schema</summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2"><Label>Name</Label><Input value={service.descriptor.name} onChange={e => setService({ ...service, descriptor: { ...service.descriptor, name: e.target.value } })} /></div>
                  <div className="sm:col-span-2"><Label>Short description</Label><Input value={service.descriptor.short_desc} onChange={e => setService({ ...service, descriptor: { ...service.descriptor, short_desc: e.target.value } })} /></div>
                  <div className="sm:col-span-2"><Label>Long description</Label><Textarea rows={2} value={service.descriptor.long_desc} onChange={e => setService({ ...service, descriptor: { ...service.descriptor, long_desc: e.target.value } })} /></div>

                  <div><Label>Fulfillment</Label>
                    <Select value={service.fulfillment.type} onChange={e => setService({ ...service, fulfillment: { type: e.target.value as any } })}>
                      <option value="ON_FULFILLMENT">ON_FULFILLMENT</option>
                      <option value="ON_DELIVERY">ON_DELIVERY</option>
                    </Select>
                  </div>
                  <div><Label>Price (preview)</Label>
                    <Input type="number" value={service.price.value} onChange={e => setService({ ...service, price: { currency: 'INR', value: Number(e.target.value) } })} />
                    <p className="text-xs text-muted-foreground">Actual price uses the selected offering's rate during publish.</p>
                  </div>

                  {/* Electrical parameters */}
                  <div><Label>Voltage (V)</Label><Input type="number" value={service.electrical_parameters.voltage.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, voltage: { ...service.electrical_parameters.voltage, value: Number(e.target.value) } } })} /></div>
                  <div><Label>Current (A)</Label><Input type="number" value={service.electrical_parameters.current.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, current: { ...service.electrical_parameters.current, value: Number(e.target.value) } } })} /></div>
                  <div><Label>Power factor</Label><Input type="number" step="0.01" value={service.electrical_parameters.power_factor.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, power_factor: { ...service.electrical_parameters.power_factor, value: Number(e.target.value) } } })} /></div>
                  <div><Label>Active power (kW)</Label><Input type="number" value={service.electrical_parameters.active_power.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, active_power: { ...service.electrical_parameters.active_power, value: Number(e.target.value) } } })} /></div>
                  <div><Label>Reactive power (kVAR)</Label><Input type="number" value={service.electrical_parameters.reactive_power.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, reactive_power: { ...service.electrical_parameters.reactive_power, value: Number(e.target.value) } } })} /></div>
                  <div><Label>Apparent power (kVA)</Label><Input type="number" value={service.electrical_parameters.apparent_power.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, apparent_power: { ...service.electrical_parameters.apparent_power, value: Number(e.target.value) } } })} /></div>
                  <div><Label>Frequency (Hz)</Label><Input type="number" value={service.electrical_parameters.frequency.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, frequency: { ...service.electrical_parameters.frequency, value: Number(e.target.value) } } })} /></div>
                  <div><Label>Energy transferred (kWh)</Label><Input type="number" value={service.electrical_parameters.energy_transferred.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, energy_transferred: { ...service.electrical_parameters.energy_transferred, value: Number(e.target.value) } } })} /></div>
                  <div><Label>Meter reading (kWh)</Label><Input type="number" value={service.electrical_parameters.meter_reading.value} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, meter_reading: { ...service.electrical_parameters.meter_reading, value: Number(e.target.value) } } })} /></div>
                  <div className="sm:col-span-2">
                    <Label>Transaction timestamp</Label>
                    <div className="flex items-center gap-2">
                      <Input value={service.electrical_parameters.transaction_timestamp} onChange={e => setService({ ...service, electrical_parameters: { ...service.electrical_parameters, transaction_timestamp: e.target.value } })} />
                      <GhostButton type="button" onClick={resetServiceTimestamp}><Timer className="h-4 w-4" /> Now</GhostButton>
                    </div>
                  </div>
                </div>
              </details>

              {/* Transaction details (for payload demo) */}
              <details className="rounded-xl border p-3" open>
                <summary className="cursor-pointer text-sm font-medium flex items-center gap-2"><Factory className="h-4 w-4" />Transaction details</summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div><Label>Buyer PID</Label><Input value={tx.buyer.participant_id} onChange={e => setTx({ ...tx, buyer: { ...tx.buyer, participant_id: e.target.value } })} /></div>
                  <div><Label>Buyer Org</Label><Input value={tx.buyer.organisation_name} onChange={e => setTx({ ...tx, buyer: { ...tx.buyer, organisation_name: e.target.value } })} /></div>
                  <div><Label>Seller PID</Label><Input value={tx.seller.participant_id} onChange={e => setTx({ ...tx, seller: { ...tx.seller, participant_id: e.target.value } })} /></div>
                  <div><Label>Seller Org</Label><Input value={tx.seller.organisation_name} onChange={e => setTx({ ...tx, seller: { ...tx.seller, organisation_name: e.target.value } })} /></div>
                  <div className="sm:col-span-2"><Label>Transaction ID</Label><Input value={tx.transaction_id} onChange={e => setTx({ ...tx, transaction_id: e.target.value })} /></div>
                  <div><Label>Order status</Label>
                    <Select value={tx.order_status} onChange={e => setTx({ ...tx, order_status: e.target.value as any })}>
                      <option value="INIT">INIT</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </Select>
                  </div>
                  <div><Label>Payment method</Label>
                    <Select value={tx.payment.payment_method} onChange={e => setTx({ ...tx, payment: { ...tx.payment, payment_method: e.target.value as any } })}>
                      <option value="UPI">UPI</option>
                      <option value="CARD">CARD</option>
                      <option value="NEFT">NEFT</option>
                    </Select>
                  </div>
                  <div><Label>Payment amount</Label><Input type="number" value={tx.payment.amount} onChange={e => setTx({ ...tx, payment: { ...tx.payment, amount: Number(e.target.value) } })} /></div>
                </div>
              </details>

              {/* Export current schema as JSON */}
              <div className="rounded-2xl border p-3 bg-muted/30">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4" /> Current schema JSON</div>
                  <Button type="button" onClick={() => handleCopy(buildOrderPayload(org, service, tx))}>
                    {copied ? (<><Check className="h-4 w-4" />Copied</>) : (<><ClipboardCopy className="h-4 w-4" />Copy</>)}
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(buildOrderPayload(org, service, tx), null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div>© {new Date().getFullYear()} chargeMOD. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">Terms</a>
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Support</a>
          </div>
        </div>
      </footer>

      {/* Publish success toast */}
      <Toast
        open={toastOpen}
        title="Offering published!"
        description={`Energy: ${energyKwh} kWh • Price: ${INR.format(pricePerKwh)}/kWh • Payout est.: ${INR.format(totals.base)}`}
        onClose={() => setToastOpen(false)}
        action={
          <div className="flex items-center gap-2">
            <GhostButton onClick={() => { setToastOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              <Building2 className="h-4 w-4" /> Go to top
            </GhostButton>
            <Button onClick={() => {
              const payload = buildOrderPayload(org, { ...service, price: { currency: 'INR', value: pricePerKwh } }, { ...tx, payment: { ...tx.payment, amount: totals.total } })
              navigator.clipboard?.writeText(JSON.stringify(payload, null, 2))
            }}>
              <ClipboardCopy className="h-4 w-4" /> Copy payload
            </Button>
          </div>
        }
      />
    </div>
  )
}
