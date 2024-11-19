# Option

`Option` proporciona una manera segura y explícita de manejar valores que pueden estar presentes (`Some`) o ausentes (`Nothing`). Este enfoque ayuda a evitar errores comunes como el acceso a valores `null` o `undefined`.

- [Ejemplo de uso](#ejemplo-de-uso)
- [Funciones](#funciones)
- [Ventajas de usar Option](#ventajas-de-usar-option)

## Ejemplo de uso

El siguiente ejemplo ilustra cómo utilizar Option para evitar manejar valores nulos de forma manual:

```ts
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función que devuelve un nombre o null si no se encuentra
function getNameUser(id) {
  if (id === 1) {
    return "juan valdez";
  }
  return null;
}

// Uso del módulo Option
const name = option(getNameUser(1));
const upperName = name.andThen((name) => option(capitalize(name)));

console.log(upperName.getOrElse("No hay nombre")); // Imprime "Juan valdez"

const name2 = option(getNameUser(2));
const upperName2 = name2.andThen((name) => option(capitalize(name)));

console.log(upperName2.getOrElse("No hay nombre")); // Imprime "No hay nombre"
```

Este enfoque evita verificar manualmente si los valores son null o undefined y hace que las operaciones sean más declarativas.

## Funciones

### `isSome` y `isNothing`

- isSome(): Retorna true si el valor está presente (Some).
- isNothing(): Retorna true si el valor está ausente (Nothing).

### `value`

- Devuelve el valor almacenado si es Some.
- Devuelve undefined si es Nothing.

### `getOrElse(defaultValue)`

- Devuelve el valor si es Some.
- Devuelve el valor predeterminado si es Nothing.

### `map`

- Aplica una función transformadora si el valor está presente.
- Retorna Nothing si el valor está ausente.

### `andThen`

Permite encadenar transformaciones que devuelven otro Option.

### `mapOr`

Aplica una función transformadora al valor, o devuelve un valor predeterminado.

### `mapOrElse`

Aplica una función predeterminada o una transformadora dependiendo del estado.

### `filter`

Devuelve Nothing si el filtro no se cumple; de lo contrario, devuelve el mismo Option.

### `match`

Ejecuta una de las funciones provistas (isSome o isNothing) dependiendo del estado del Option.

## Ventajas de usar Option

- **Elimina el riesgo de errores por valores nulos o indefinidos**:
  Los valores se manejan explícitamente como Some o Nothing.

- **Facilidad de composición**:
  Métodos como map y andThen permiten encadenar transformaciones de forma fluida.

- **Código más claro**:
  En lugar de verificar constantemente valores nulos o indefinidos, se trabaja con métodos consistentes.

- **Uso explícito de errores y valores predeterminados**:
  Métodos como getOrElse y match facilitan manejar valores predeterminados o tomar decisiones basadas en el estado.
