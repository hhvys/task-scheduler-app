import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PipelinesManager from '../PipelinesManager';

jest.useFakeTimers();

const renderInStrictMode = (ui) =>
  render(<React.StrictMode>{ui}</React.StrictMode>);

describe('1.', () => {
  test('IDs of pipeline should be continues starting from 1.', () => {
    renderInStrictMode(<PipelinesManager />);
    const add1sPipelines = screen.getByTestId('add-pipeline-1000');

    fireEvent.click(add1sPipelines);
    fireEvent.click(add1sPipelines);
    fireEvent.click(add1sPipelines);

    expect(screen.getByTestId('p-id-1')).toHaveTextContent('1');
    expect(screen.getByTestId('p-id-2')).toHaveTextContent('2');
    expect(screen.getByTestId('p-id-3')).toHaveTextContent('3');
  });
});

describe('2.', () => {
  test('First pipeline should be IN_PROGRESS as soon as it is added.', () => {
    renderInStrictMode(<PipelinesManager />);
    const add1sPipelines = screen.getByTestId('add-pipeline-1000');

    fireEvent.click(add1sPipelines);

    expect(screen.getByTestId('p-status-1')).toHaveTextContent('IN_PROGRESS');
  });
  test('If a pipeline is IN_PROGRESS then new pipeline should be in QUEUE when added.', () => {
    renderInStrictMode(<PipelinesManager />);
    const add1sPipelines = screen.getByTestId('add-pipeline-1000');

    fireEvent.click(add1sPipelines);
    fireEvent.click(add1sPipelines);
    fireEvent.click(add1sPipelines);

    expect(screen.getByTestId('p-status-1')).toHaveTextContent('IN_PROGRESS');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('QUEUE');
    expect(screen.getByTestId('p-status-3')).toHaveTextContent('QUEUE');
  });
  test('Pipeline should be in COMPLETED state after its duration, if it does not TIMEOUT.', () => {
    renderInStrictMode(<PipelinesManager timeoutDuration={2000} />);
    const add1sPipelines = screen.getByTestId('add-pipeline-1000');

    fireEvent.click(add1sPipelines);

    expect(screen.getByTestId('p-status-1')).toHaveTextContent('IN_PROGRESS');

    act(() => {
      jest.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('COMPLETED');
  });
  test('Queued pipeline should be IN_PROGRESS as soon as IN_PROGRESS pipeline finishes execution.', () => {
    renderInStrictMode(<PipelinesManager timeoutDuration={1800} />);
    const add1sPipelines = screen.getByTestId('add-pipeline-1000');

    fireEvent.click(add1sPipelines);
    fireEvent.click(add1sPipelines);
    fireEvent.click(add1sPipelines);

    expect(screen.getByTestId('p-status-1')).toHaveTextContent('IN_PROGRESS');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('QUEUE');
    expect(screen.getByTestId('p-status-3')).toHaveTextContent('QUEUE');

    act(() => {
      jest.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('COMPLETED');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('IN_PROGRESS');
    expect(screen.getByTestId('p-status-3')).toHaveTextContent('QUEUE');

    act(() => {
      jest.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('COMPLETED');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('COMPLETED');
    expect(screen.getByTestId('p-status-3')).toHaveTextContent('IN_PROGRESS');

    act(() => {
      jest.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('COMPLETED');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('COMPLETED');
    expect(screen.getByTestId('p-status-3')).toHaveTextContent('COMPLETED');
  });

  test('Pipeline should be in RETRY state after `timeoutDuration` if it does not finish within timeoutDuration.', () => {
    renderInStrictMode(<PipelinesManager timeoutDuration={2500} />);
    const add3sPipelines = screen.getByTestId('add-pipeline-3000');

    fireEvent.click(add3sPipelines);

    expect(screen.getByTestId('p-status-1')).toHaveTextContent('IN_PROGRESS');

    act(() => {
      jest.advanceTimersByTime(2600);
    });
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('RETRY');
  });

  test('If Pipeline doest not finish within `timeoutDuration` even after one retry, we should mark it as TIMEOUT without waiting for its completion.', () => {
    renderInStrictMode(<PipelinesManager timeoutDuration={2500} />);
    const add3sPipelines = screen.getByTestId('add-pipeline-3000');

    fireEvent.click(add3sPipelines);

    expect(screen.getByTestId('p-status-1')).toHaveTextContent('IN_PROGRESS');

    act(() => {
      jest.advanceTimersByTime(5200); // no need to wait for 6s, we just have to wait for timeoutDuration * 2
    });
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('TIMEOUT');
  });

  test('Next pipeline should be in QUEUE when previous pipeline is in RETRY state.', () => {
    renderInStrictMode(<PipelinesManager timeoutDuration={2500} />);
    const add3sPipelines = screen.getByTestId('add-pipeline-3000');
    
    fireEvent.click(add3sPipelines);
    
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('IN_PROGRESS');
    
    act(() => {
      jest.advanceTimersByTime(2600);
    });
    
    fireEvent.click(add3sPipelines);
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('RETRY');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('QUEUE');
  });
  
  test('Queued pipeline should be IN_PROGRESS if previous pipeline TimesOut.', () => {
    renderInStrictMode(<PipelinesManager timeoutDuration={2500} />);
    const add3sPipelines = screen.getByTestId('add-pipeline-3000');
    const add1sPipelines = screen.getByTestId('add-pipeline-1000');
    
    fireEvent.click(add3sPipelines);
    fireEvent.click(add1sPipelines);
    
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('IN_PROGRESS');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('QUEUE');
    
    act(() => {
      jest.advanceTimersByTime(2600);
    });
    
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('RETRY');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('QUEUE');
    
    act(() => {
      jest.advanceTimersByTime(2600);
    });
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('TIMEOUT');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('IN_PROGRESS');
    
    act(() => {
      jest.advanceTimersByTime(1100);
    });
    expect(screen.getByTestId('p-status-1')).toHaveTextContent('TIMEOUT');
    expect(screen.getByTestId('p-status-2')).toHaveTextContent('COMPLETED');
  });
});
