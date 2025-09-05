// Opción 1: Iconos internos con mejor padding
<div className="relative">
  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
  <Input className="pl-12 ..." placeholder="Ingresá tu email" />
</div>

// Opción 2: Iconos en labels (ACTUAL)
<Label className="flex items-center">
  <Mail className="h-4 w-4 text-gray-500 mr-2" />
  Email
</Label>
<Input className="px-4 ..." placeholder="Ingresá tu email" />

// Opción 3: Sin iconos (minimalista)
<Label>Email</Label>
<Input className="px-4 ..." placeholder="Ingresá tu email" />
