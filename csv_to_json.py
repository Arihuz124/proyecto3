import csv
import json
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_CSV = os.path.join(BASE_DIR, "weatherAUS.csv")
OUTPUT_JSON = os.path.join(BASE_DIR, "weatherAUS.json")
#separamos las columnas con numeros
NUMERIC_COLUMNS = {
    "MinTemp", "MaxTemp", "Rainfall", "Evaporation", "Sunshine",
    "WindGustSpeed", "WindSpeed9am", "WindSpeed3pm",
    "Humidity9am", "Humidity3pm", "Pressure9am", "Pressure3pm",
    "Cloud9am", "Cloud3pm", "Temp9am", "Temp3pm"
}
#ahoralas que sean de texto
CATEGORICAL_COLUMNS = {
    "Location", "WindGustDir", "WindDir9am", "WindDir3pm",
    "RainToday", "RainTomorrow"
}

DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def parse_value(column: str, raw_value: str):
    cleaned = raw_value.strip()
    if cleaned == "" or cleaned.upper() == "NA":
        return None
    if column == "Date":
        if not DATE_PATTERN.match(cleaned):
            raise ValueError(f"Formato de fecha inválido: {cleaned}")
        return cleaned
    if column in NUMERIC_COLUMNS:
        return float(cleaned)
    if column in CATEGORICAL_COLUMNS:
        return str(cleaned)
    return cleaned


def transform_csv_to_json(csv_path: str, json_path: str) -> None:
    records = []
    with open(csv_path, mode="r", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)
        # Limpiar posibles espacios en los encabezados
        reader.fieldnames = [name.strip() for name in reader.fieldnames]

        for row in reader:
            record = {
                col.strip(): parse_value(col.strip(), val)
                for col, val in row.items()
            }
            records.append(record)

    # Exportación compacta para mantenerse por debajo del límite de 100 MB de GitHub
    with open(json_path, mode="w", encoding="utf-8") as json_file:
        json.dump(records, json_file, ensure_ascii=False, separators=(",", ":"))

    validate_json(json_path, expected_count=len(records))


def validate_json(json_path: str, expected_count: int) -> None:
    with open(json_path, mode="r", encoding="utf-8") as json_file:
        data = json.load(json_file)

    assert isinstance(data, list), "La estructura raíz debe ser un arreglo JSON."
    assert len(data) == expected_count, (
        f"Conteo inconsistente: {len(data)} != {expected_count}"
    )

    sample = data[0]
    assert isinstance(sample["Date"], str)
    assert isinstance(sample["Location"], str)
    assert isinstance(sample["MinTemp"], (float, type(None)))

    size_mb = os.path.getsize(json_path) / (1024 * 1024)
    print(f"Validación exitosa: {len(data)} registros exportados ({size_mb:.2f} MB).")


if __name__ == "__main__":
    transform_csv_to_json(INPUT_CSV, OUTPUT_JSON)
