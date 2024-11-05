# Helpers

Listado de funciones

- [Result]()
- [Option]()
- [Utilidades para Ts](#utilidades-para-ts).

### Utilidades para TS

Algunas funciones comunes que se pueden usar para sacar más provecho a typescript.

#### exhaustiveMatchingGuard

Aplicando el tipo de dato `never` a traves de `exhaustiveMatchingGuard` en TypeScript, cuando usamos una estructura de control como un `switch` o un `if` para manejar un tipo que puede ser de varios tipos posibles, el compilador (y editor) nos advertirá si no hemos cubierto alguno de los casos.

##### Ejemplo de uso

Supongamos que tenemos un tipo _Shape_ que puede ser uno de tres posibles tipos:

- _Circle_: con un radio.
- _Rectangle_: con un ancho y alto.
- _Triangle_: con una base y altura.

Y tenemos una función que calcula el area de cada forma pero queremos asegurarnos de que cubrimos todos los casos al manejar este tipo, usando `exhaustiveMatchingGuard` podemos forzar una verificación en tiempo de compilación de todas las posibilidades (la potencia real aquí es que el mismo editor advertira de este error mientras estemos codeando).

> Obviamente hay mejores formas para afrontar este problema en especifico. La idea del ejemplo es mostrar el uso de `exhaustiveMatchingGuard`

```ts
type Shape =
  | { kind: "Circle"; radius: number }
  | { kind: "Rectangle"; width: number; height: number }
  | { kind: "Triangle"; base: number; height: number };

function exhaustiveMatchingGuard(_: never) {
  throw new Error("Never value");
}

function calculateAreaWithError(shape: Shape): number {
  switch (shape.kind) {
    case "Circle":
      return Math.PI * shape.radius ** 2;
    case "Rectangle":
      return shape.width * shape.height;
    default:
      exhaustiveMatchingGuard(shape); // ❌​ Marcara un error porque falta el caso "Triangle"
  }
}

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "Circle":
      return Math.PI * shape.radius ** 2;
    case "Rectangle":
      return shape.width * shape.height;
    case "Triangle":
      return (shape.base * shape.height) / 2;
    default:
      exhaustiveMatchingGuard(shape); // ✅ Esto no dara problemas
  }
}
```

##### ¿Cómo funciona `exhaustiveMatchingGuard` aquí?

La función `exhaustiveMatchingGuard` espera como argumento un valor de tipo `never` que significa que no puede existir. Con esto Typescript sabe que el código no debería a llegar a ejecutar esa parte.

Si agregamos una nueva variante al tipo _Shape_, como por ejemplo _Square_, el compilador nos marcará un error en la línea `exhaustiveMatchingGuard(shape)` porque el switch no estará cubriendo el caso de _Square_. Y en teoría la línea del `exhaustiveMatchingGuard` podría llegar a ejecutarse.
