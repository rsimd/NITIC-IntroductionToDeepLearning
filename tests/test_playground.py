from pathlib import Path

import numpy as np
import torch
from torch import nn

from nitic_playground import create_playground_recorder, sequential_to_playground_html


def test_sequential_to_playground_html_writes_file(tmp_path: Path) -> None:
    torch.manual_seed(0)
    model = nn.Sequential(
        nn.Linear(2, 3),
        nn.Tanh(),
        nn.Linear(3, 1),
        nn.Sigmoid(),
    )
    X = np.array([[-1.0, -1.0], [-1.0, 1.0], [1.0, -1.0], [1.0, 1.0]])
    y = np.array([0, 1, 1, 0])
    output = tmp_path / "playground.html"

    html = sequential_to_playground_html(model, X, y, output)

    assert output.exists()
    saved_html = output.read_text(encoding="utf-8")
    assert "PyTorch Playground" in html
    assert "<iframe" in html
    assert "PyTorch で記録した学習過程" in saved_html
    assert '"activation": "tanh"' in saved_html
    assert '"activation": "sigmoid"' in saved_html


def test_recorder_captures_python_training_snapshots() -> None:
    torch.manual_seed(0)
    model = nn.Sequential(nn.Linear(1, 4), nn.Tanh(), nn.Linear(4, 1))
    X = np.linspace(-1, 1, 12).reshape(-1, 1)
    y = np.sin(X * np.pi)
    optimizer = torch.optim.SGD(model.parameters(), lr=0.05)
    criterion = nn.MSELoss()
    recorder = create_playground_recorder(model, X, y, problem="regression", grid_size=12)

    for epoch in range(3):
        optimizer.zero_grad()
        prediction = model(torch.tensor(X, dtype=torch.float32))
        loss = criterion(prediction, torch.tensor(y, dtype=torch.float32))
        loss.backward()
        optimizer.step()
        recorder.capture(step=epoch, loss=float(loss.item()))

    html = recorder.to_html()

    assert len(recorder.frames) == 3
    assert "&quot;kind&quot;: &quot;line&quot;" in html
    assert "&quot;step&quot;: 2" in html
