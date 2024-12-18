# Result

El módulo Result ofrece una forma sencilla de manejar resultados que pueden ser exitosos (OK) o representar un estado de "error" (Error). Es útil para evitar excepciones y manejar errores de manera explícita.

- [Los Errores](#los-errores)
- [Ejemplo de uso](#ejemplo-de-uso)
- [Funciones](#funciones)
- [Beneficios de usar Result](#beneficios-de-usar-result).

## Los Errores

Todos los estado de error en esta implementación de Result debe cumplir con ser un objeto y tener una propiedad `kind`:

```
export interface ErrorResult {
  kind: string;
}
```

[*] Aunque es posible saltarse esta regla. La descisión de implementarla es manejar el caso de error de manera estandarizada y permitiendo que ese estado pueda irse extendiendo según las necesidad de cada caso.

## Ejemplo de uso

Un uso muy común de `Result` es aplicarlo en el consumo de APIS o validación de formulario.

```ts
interface ApiError extends ErrorResult {
  kind: "ApiError";
  statusCode: number;
  message: string;
}

interface BusinessError extends ErrorResult {
  kind: "BusinessError";
}

const businessError: BusinessError = {
  kind: "BusinessError",
};

// Llamada a una API
async function fetchUserData(
  userId: string
): Promise<Result<{ id: string; name: string }, ApiError | BusinessError>> {
  try {
    const response = await fetch(`https://url_api.com/users/${userId}`);

    if (!response.ok) {
      return result.Error({
        kind: "ApiError",
        statusCode: response.status,
        message: `Error al obtener el usuario: ${response.statusText}`,
      });
    }

    const data = await response.json();

    if (data.id && data.name) {
      return result.OK(data);
    }

    return result.Error(businessError);
  } catch (e) {
    return result.Error({
      kind: "ApiError",
      statusCode: 500,
      message: "Error inesperado al comunicarse con el servidor.",
    });
  }
}
```

Con esto al momento de hacer uso de la función podemos saber los diferentes escenarios de error:

```ts
// Función para manejar la respuesta de la API
async function handleFetchUser(userId: string) {
  const userResult = await fetchUserData(userId);

  userResult.match({
    ifOk: (user) => {
      console.log(`Usuario encontrado: ${user.name} (ID: ${user.id})`);
    },
    ifError: (error) => {
      if (error.kind === "ApiError") {
        console.error(`Error (${error.statusCode}): ${error.message}`);
        return;
      }
      console.error(`Error (${error.kind})`);
    },
  });
}
```

Otros ejemplos de uso:

```ts
function processTransaction(
  balance: number,
  amount: number
): Result<number, { kind: string; message: string }> {
  if (amount > balance) {
    return result.Error({
      kind: "TransactionError",
      message: "Fondos insuficientes.",
    });
  }
  return result.OK(balance - amount);
}
```

## Funciones

- ### `isOk` y `isError`

Describe si el valor es de estado correcto o de error.

- ### `value`

Devuelve el valor del Result, en caso sea un error devolvera el objeto que este describiendo el error.

- ### `getOrElse(defaultValue)`

Devuelve el valor correcto en caso de ser `OK` o el valor ingresado por defecto en la función en caso el `Result` tenga un estado de `Error`.

- ### `getOrThrow(errorMessage)`

Devuelve el valor correcto en el caso de ser `Ok` o generara una excepción con el mensaje proporcionado. Esto puede ser util en casos donde se quiera compartir código con otros entornos que no estén manejando los errores con `Result`.

- ### `match({ifOk, ifError})`

Esta función retorna el resultado de cualquiera de estas funciones.

- `ifOk` debe ser una función que reciba el dato `Ok` del `Result`. En caso de tener ser un `Error` no se ejecuta.
- `ifError` debe ser una función que reciba el dato `Error` del `Result`. En caso de tener ser un `OK` no se ejecuta.

## Beneficios de usar Result

- **Código más predecible**: No se lanza ninguna excepción inesperada; todos los errores están encapsulados y son declarados.
- **Facilidad de pruebas**: Las funciones son más fáciles de probar porque los errores son datos en lugar de excepciones.
- **Escalabilidad**: Ideal para aplicaciones con lógica compleja que requiere manejo explícito de errores (por ejemplo, validaciones, llamadas API)
