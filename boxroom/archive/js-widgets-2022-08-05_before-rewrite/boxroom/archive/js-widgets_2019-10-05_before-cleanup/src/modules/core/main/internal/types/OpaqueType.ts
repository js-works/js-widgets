type OpaqueType<Name extends string, T = {}> = unknown & T & {
  __opaqueType__: Name 
}

export default OpaqueType