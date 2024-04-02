import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import CustomDirection from "../../custom-map/customDirection";
import CustomerMarker from "../../custom-map/customerMarker";
import DepotMarker from "../../custom-map/depotMarker";
import MapControl from "../../custom-map/mapControl";
import TimelineJourney from "./timelineJourney";
import { checkExistNode, getCustomersOfJourney, getDepotsOfJourney } from '../../../utilities'

function DetailSolution(props) {
    const delivery = props.location.state.delivery;

    const HN_COOR = { lat: 21.028511, lng: 105.804817 };

    const [state, setState] = useState({
        defaultZoom: 13,
        center: HN_COOR,
        isProgress: false,
        showTimeline: false,
        showInputInfo: false,
        isTracking: false,
    });

    const { trackingRoute, solution, solutions, directions, customers, depots, problemAssumption, showDepotMarker, defaultZoom, center} = state;

    useEffect(() => {
        delivery.solution.id = 1;
        delivery.solution.isSelected = delivery.isSelected;
        let solutions = [delivery.solution];
        processSolutions(solutions);
        setState({
            ...state,
            trackingRoute: delivery,
            solution: solutions[0],
            solutions: solutions,
            directions: solutions[0].directions,
            customers: setCustomersMarker(delivery.problemAssumption.orders),
            depots: setDepotsMarker(delivery.problemAssumption.depots),
            problemAssumption: delivery.problemAssumption,
            showDepotMarker: true,
        });
    }, []);

    const setDirections = (solution) => {
        const color = ['#fcba03', '#fc1703', '#03fc0f', '#038cfc', '#9d03fc', '#03fcb6', '#2a055c']

        let directions = [];
        solution.journeys.map((journey, journeyIndex) => {
            let directionColor = color[Math.floor(Math.random() * 8)];
            let directionOfJourney = [];
            journey.routes.map((route, routeIndex) => {
                let directionArcs = route.arcs.map((arc, arcIndex) => {
                    return ({
                        id: 1000 * journeyIndex + 100 * routeIndex + arcIndex,
                        from: arc.fromNode,
                        to: arc.toNode,
                        strokeColor: directionColor,
                        isShowed: true,
                    });
                });
                directionOfJourney = directionOfJourney.concat(directionArcs);
            });
            directions = directions.concat(directionOfJourney);
            journey.directions = directionOfJourney;
        });
        solution.directions = directions;
    }

    const processSolutions = (solutions) => {
        solutions = solutions.map((solution, index) => {
            solution.efficiency = Math.round(solution.efficiency * 100) / 100;
            solution.focusJourneyId = 0;
            setDirections(solution);
            return solution;
        })
    }

    const setCustomersMarker = (orders) => {
        let customersData = [];
        let customerCodeArr = [];
        orders.forEach((order) => {
            if (!customerCodeArr.includes(order.customer.code)) {
                customersData.push(order.customer)
            }
        })
        if(customersData.length > 0) customersData.map((customer) => {
            customer.marker = {
                id: customer.id,
                code: customer.code,
                lat: customer.latitude,
                lng: customer.longitude,
                isShowed: true,
            }
        });
        return customersData;

    }

    const setDepotsMarker = (depotsData) => {
        depotsData.map((depot) => {
            depot.marker = {
                id: depot.id,
                code: depot.code,
                lat: depot.latitude,
                lng: depot.longitude,
                color: 'white',
                isShowed: true,
            }
        });
        return depotsData;
    }

    const setShowMarkerInfo = (marker) => {
        let customers = customers.map((customer) => {
            if (customer.code === marker.code) {
                let showMarker = customer.marker;
                showMarker.isShowInfo = marker.isShowInfo;
                showMarker.infoWindow = marker.infoWindow;
                customer.marker = showMarker;
                return customer;
            } else {
                return customer;
            }
        });
        let depots = depots.map((depot) => {
            if (depot.code === marker.code) {
                let showMarker = depot.marker;
                showMarker.isShowInfo = marker.isShowInfo;
                showMarker.infoWindow = marker.infoWindow;
                depot.marker = showMarker;
                return depot;
            } else {
                return depot;
            }
        });
        setState({
            ...state,
            customers: customers,
            depots: depots,
        });
    }

    // Timeline display, hide functions

    const setShowTimeline = (showTimeline) => {
        setState({
            ...state,
            showTimeline: showTimeline
        })
    }

    const showAllJourney = () => {
        let depots = state.depots;
        depots.map((depot) => {
            depot.marker.isShowed = true;
            depot.marker.code = depot.code;
        });
        let customers = state.customers;
        setState({
            ...state,
            customers: [] });
        customers.map((customer) => {
            customer.marker.isShowed = true;
            customer.marker.code = customer.code;
        });
        let directions = state.directions;
        directions.map((direction) => {
            direction.isShowed = true;
        });
        let solution = state.solution;
        solution.focusJourneyId = 0;
        setTimeout(() => {
            setState({
                ...state,
                depots: depots,
                customers: customers,
                solution: solution,
                directions: directions
            });
        }, 250)
    }

    const changeSolution = (solution) => {
        setState({ directions: [] });
        setState({
            ...state,
            solution: solution,
        });
        setTimeout(() => {
            setState({
                directions: solution.directions,
            });
        }, 2000);
        setTimeout(() => {
            showAllJourney();
        }, 2500);

    }
    const showCustomerMarkerInfo = (marker) => {
        let customers = state.customers.map((customer) => {
            if (customer.code === marker.code) {
                let showMarker = customer.marker;
                showMarker.isShowInfo = true;
                showMarker.infoWindow = marker.infoWindow;
                customer.marker = showMarker;
                return customer;
            } else {
                return customer;
            }
        });
        setState({
            ...state,
            customers: customers
        });
    }

    const showDepotMarkerInfo = (marker) => {
        let depots = state.depots.map((depot) => {
            if (depot.code === marker.code) {
                let showMarker = depot.marker;
                showMarker.isShowInfo = true;
                showMarker.infoWindow = marker.infoWindow;
                depot.marker = showMarker;
                return depot;
            } else {
                return depot;
            }
        });
        setState({
            ...state,
            depots: depots
        });
    }

    const focusCustomers = (showedCustomers) => {
        let customers = state.customers;
        setState({
            ...state,
            customers: [] });
        customers.map((customer, index) => {
            let idx = checkExistNode(customer, showedCustomers);
            if (idx !== null) {
                customer.marker.isShowed = true;
                customer.marker.code = (idx + 1) + "";
            } else {
                customer.marker.isShowed = false;
            }
        });
        setTimeout(() => {
            setState({
                ...state,
                customers: customers });
        }, 200
        );
    }

    const focusDepots = (showedDepots) => {
        let depots = state.depots;
        depots.map((depot, index) => {
            depot.marker.isShowed = checkExistNode(depot, showedDepots) === null ? false : true;
        });
        setState({
            ...state,
            depots: depots });
    }

    const focusDirections = (showedDirections) => {
        let directions = state.directions;
        directions.map((direction, index) => {
            direction.isShowed = showedDirections.find(showedDirection => showedDirection.id === direction.id) === undefined ? false : true;
        });
        setState({
            ...state,
            directions: directions });
    }

    const focusJourney = (journey) => {
        let solution = state.solution;
        solution.focusJourneyId = journey.id;
        setState({
            ...state,
            solution });
        let customersOfJourney = getCustomersOfJourney(journey);
        let depotsOfJourney = getDepotsOfJourney(journey);
        focusCustomers(customersOfJourney);
        focusDepots(depotsOfJourney);
        focusDirections(journey.directions);
    }

    //End Timeline display, hide functions
    const mapContainerStyle = {
        height: "500px",
        width: "auto",
    }

    return (
        <div className="box" style={{ minHeight: "450px" }}>
            <div className="box-body">
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                >
                    <GoogleMap
                        defaultZoom={defaultZoom}
                        center={center}
                        mapContainerStyle={mapContainerStyle}
                    >
                        {directions && directions.map((direction, index) => {
                            if (direction.isShowed === true)
                                return (
                                    <CustomDirection
                                        key={index + 1}
                                        index={index + 1}
                                        strokeColor={direction.strokeColor}
                                        from={direction.from}
                                        to={direction.to}
                                    />
                                );
                        })}
                        {customers && customers.map((customer, index) => {
                            if (customer.marker.isShowed === true)
                                return (
                                    <CustomerMarker
                                        key={index + 1}
                                        marker={customer.marker}
                                        setShow={setShowMarkerInfo}
                                    >
                                    </CustomerMarker>
                                );
                        })}
                        {state.depots && state.depots.map((depot, index) => {
                            if (depot.marker.isShowed === true)
                                return (
                                    <DepotMarker
                                        key={index + 1}
                                        marker={depot.marker}
                                        setShow={setShowMarkerInfo}
                                        type={"DEPOT"}
                                    >
                                    </DepotMarker>
                                );
                        })}
                        {/* {state.showTimeline === true &&
                            <MapControl position={window.google.maps.ControlPosition.BOTTOM_CENTER}>
                                <TimelineJourney
                                    solutions={state.solutions}
                                    solution={state.solution}
                                    changeSolution={changeSolution}
                                    setDirections={setDirections}
                                    showCustomerMarkerInfo={showCustomerMarkerInfo}
                                    showDepotMarkerInfo={showDepotMarkerInfo}
                                    problemAssumption={problemAssumption}
                                    focusJourney={focusJourney}
                                    showAllJourney={showAllJourney}
                                />
                            </MapControl>
                        }
                        {state.solutions &&
                            <MapControl position={window.google.maps.ControlPosition.RIGHT_TOP}>
                                <button type="submit" className="btn btn-sm btn-success" onClick={() => setShowTimeline(!state.showTimeline)}>{state.showTimeline === true ? "Hide Timeline" : "Show Timeline"}</button>
                            </MapControl>
                        } */}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}

export default (withTranslate(DetailSolution))