# Result

El módulo Result ofrece una forma sencilla de manejar resultados que pueden ser exitosos (OK) o representar un estado de "error" (Error). Es útil para evitar excepciones y manejar errores de manera explícita.

- [Los Errores](#los-errores)
- [Ejemplo de uso](#ejemplo-de-uso)
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

## Funciones

## Beneficios de usar Result

Consistencia en el manejo de errores:

- En lugar de lanzar excepciones, encapsulamos el error en un Result.Error.
- Esto asegura que todas las rutas del código sean explícitas y manejadas.

Uso claro de Result:

- Las respuestas exitosas están en un Result.OK, mientras que los errores están en un Result.Error.

Beneficio práctico:

- Este enfoque es ideal para sistemas robustos, donde el manejo explícito de errores es crucial, como aplicaciones con formularios complejos o APIs con múltiples pasos de validación.
